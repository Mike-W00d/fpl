import { validate } from "@/lib/zod/validation";
import { createServiceClient } from "@/lib/supabase/service";
import { calculateNoTransferScores } from "@/lib/fpl/no-transfer-engine";
import type { NoTransferResult } from "@/lib/fpl/no-transfer-engine";
import type { History } from "@/lib/zod/schemas/elementSummary";

const FPL_BASE = "https://fantasy.premierleague.com/api";

export async function fetchNoTransferData(
  teamId: string,
): Promise<NoTransferResult> {
  const supabase = createServiceClient();

  // Batch 1: GW1 picks, entry history, players from DB, finished GWs from DB (parallel)
  const [gw1PicksRes, entryHistoryRes, playersResult, gameweekStatsResult] =
    await Promise.all([
      fetch(`${FPL_BASE}/entry/${teamId}/event/1/picks/`, {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(10_000),
      }),
      fetch(`${FPL_BASE}/entry/${teamId}/history/`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(10_000),
      }),
      supabase.from("players").select("element_id, web_name, element_type"),
      supabase
        .from("gameweek_stats")
        .select("gameweek_number, average_score")
        .order("gameweek_number", { ascending: true }),
    ]);

  if (!gw1PicksRes.ok || !entryHistoryRes.ok) {
    if (gw1PicksRes.status === 404 || entryHistoryRes.status === 404) {
      throw new Error("FPL team not found. Check your Team ID and try again.");
    }
    throw new Error("Failed to fetch data from FPL API");
  }

  if (playersResult.error) {
    throw new Error(
      `Failed to fetch players: ${playersResult.error.message}`,
    );
  }

  if (gameweekStatsResult.error) {
    throw new Error(
      `Failed to fetch gameweek stats: ${gameweekStatsResult.error.message}`,
    );
  }

  const [gw1PicksData, entryHistoryData] = await Promise.all([
    gw1PicksRes.json(),
    entryHistoryRes.json(),
  ]);

  const gw1Picks = validate("gameweekPicks", gw1PicksData);
  const entryHistory = validate("entryHistory", entryHistoryData);

  // Build player element info map from DB
  const playerElements = new Map(
    playersResult.data.map(
      (row: { element_id: number; web_name: string; element_type: number }) => [
        row.element_id,
        { webName: row.web_name, elementType: row.element_type },
      ],
    ),
  );

  // Get unique player IDs from GW1 picks
  const gw1PlayerIds = gw1Picks.picks.map((p) => p.element);

  // Batch 2: Fetch element summaries for all 15 GW1 players (parallel)
  const elementResults = await Promise.allSettled(
    gw1PlayerIds.map((id) =>
      fetch(`${FPL_BASE}/element-summary/${id}/`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(10_000),
      }).then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return { id, data };
      }),
    ),
  );

  // Build element history map
  const elementHistories = new Map<number, History[]>();
  for (const result of elementResults) {
    if (result.status === "fulfilled" && result.value) {
      try {
        const summary = validate("elementSummary", result.value.data);
        elementHistories.set(result.value.id, summary.history);
      } catch {
        // Player may have left PL — treat as no history
        elementHistories.set(result.value.id, []);
      }
    }
  }

  // Build finished gameweeks list and average score map from DB
  const finishedGameweeks = gameweekStatsResult.data.map(
    (row: { gameweek_number: number }) => row.gameweek_number,
  );
  const averageScoreMap = new Map(
    gameweekStatsResult.data.map(
      (row: { gameweek_number: number; average_score: number }) => [
        row.gameweek_number,
        row.average_score,
      ],
    ),
  );

  // Build actual scores map from entry history
  const actualScores = new Map(
    entryHistory.current.map((gw) => [
      gw.event,
      { points: gw.points, transferCost: gw.event_transfers_cost },
    ]),
  );

  // Build chips map
  const chipsUsed = new Map(
    entryHistory.chips.map((c) => [c.event, c.name]),
  );

  const result = calculateNoTransferScores(
    gw1Picks.picks,
    playerElements,
    elementHistories,
    finishedGameweeks,
    actualScores,
    chipsUsed,
  );

  // Attach average scores from DB
  for (const gw of result.gameweeks) {
    gw.averageScore = averageScoreMap.get(gw.event) ?? 0;
  }

  return result;
}
