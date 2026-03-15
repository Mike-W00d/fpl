import type { Pick } from "@/lib/zod/schemas/gameweekPicks";
import type { History } from "@/lib/zod/schemas/elementSummary";

// ── Types ──────────────────────────────────────────────────────────────

export interface Gw1Player {
  element: number;
  webName: string;
  elementType: number; // 1=GKP 2=DEF 3=MID 4=FWD
  position: number; // 1-15 (1-11 starting, 12-15 bench)
  isCaptain: boolean;
  isViceCaptain: boolean;
}

export interface GameweekResult {
  event: number;
  noTransferScore: number;
  actualScore: number;
  averageScore: number;
  transferCost: number;
  chipUsed: string | null;
  details: {
    starting: { element: number; points: number; minutes: number }[];
    bench: { element: number; points: number; minutes: number }[];
    captainElement: number;
    captainPlayed: boolean;
    viceCaptainElement: number;
    viceCaptainPlayed: boolean;
    subsIn: number[];
    subsOut: number[];
  };
}

export interface NoTransferResult {
  gw1Players: Gw1Player[];
  gameweeks: GameweekResult[];
  totals: {
    noTransferTotal: number;
    actualTotal: number;
    difference: number;
    totalTransferCost: number;
  };
}

interface PlayerGwData {
  totalPoints: number;
  minutes: number;
}

// Map from element id → array of History entries (one per fixture in that GW)
type ElementHistoryMap = Map<number, History[]>;

// ── Helpers ────────────────────────────────────────────────────────────

/** Aggregate points and minutes for a player in a given GW (handles DGW). */
function getPlayerGwData(
  historyByRound: ElementHistoryMap,
  element: number,
  round: number,
): PlayerGwData {
  const allHistory = historyByRound.get(element);
  if (!allHistory) return { totalPoints: 0, minutes: 0 };

  const entries = allHistory.filter((h) => h.round === round);
  if (entries.length === 0) return { totalPoints: 0, minutes: 0 };

  return {
    totalPoints: entries.reduce((s, e) => s + e.total_points, 0),
    minutes: entries.reduce((s, e) => s + e.minutes, 0),
  };
}

/** Check if a formation is valid: ≥1 GKP, ≥3 DEF, ≥2 MID, ≥1 FWD */
function isValidFormation(
  xi: { element: number; elementType: number }[],
): boolean {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const p of xi) {
    counts[p.elementType as keyof typeof counts]++;
  }
  return counts[1] >= 1 && counts[2] >= 3 && counts[3] >= 2 && counts[4] >= 1;
}

// ── Main engine ────────────────────────────────────────────────────────

export function calculateNoTransferScores(
  gw1Picks: Pick[],
  playerElements: Map<number, { webName: string; elementType: number }>,
  /** All history entries per element (across all GWs) */
  elementHistories: Map<number, History[]>,
  finishedGameweeks: number[],
  /** Actual scores per GW (points after deductions) */
  actualScores: Map<number, { points: number; transferCost: number }>,
  /** Chips used per GW */
  chipsUsed: Map<number, string>,
): NoTransferResult {
  // Build GW1 player list
  const gw1Players: Gw1Player[] = gw1Picks.map((pick) => {
    const info = playerElements.get(pick.element);
    return {
      element: pick.element,
      webName: info?.webName ?? `Player ${pick.element}`,
      elementType: info?.elementType ?? pick.element_type,
      position: pick.position,
      isCaptain: pick.is_captain,
      isViceCaptain: pick.is_vice_captain,
    };
  });

  const captainElement =
    gw1Picks.find((p) => p.is_captain)?.element ?? gw1Picks[0].element;
  const viceCaptainElement =
    gw1Picks.find((p) => p.is_vice_captain)?.element ?? gw1Picks[1].element;

  // Build a combined history map keyed by element
  const historyByElement: ElementHistoryMap = elementHistories;

  const gameweeks: GameweekResult[] = [];

  for (const gw of finishedGameweeks) {
    const chip = chipsUsed.get(gw) ?? null;
    const isBenchBoost = chip === "bboost";
    const isTripleCaptain = chip === "3xc";

    // Get points for all 15 players
    const playerData = gw1Players.map((p) => ({
      ...p,
      ...getPlayerGwData(historyByElement, p.element, gw),
    }));

    const starters = playerData.filter((p) => p.position <= 11);
    const bench = playerData.filter((p) => p.position >= 12);
    // Sort bench by original position (12=GK sub, 13, 14, 15)
    bench.sort((a, b) => a.position - b.position);

    const subsIn: number[] = [];
    const subsOut: number[] = [];

    // Auto-sub logic (skip if bench boost)
    if (!isBenchBoost) {
      // Process each starter who didn't play
      for (const starter of [...starters]) {
        if (starter.minutes > 0) continue;

        // Try to find a valid bench replacement
        for (const benchPlayer of bench) {
          if (benchPlayer.minutes === 0) continue;
          if (subsIn.includes(benchPlayer.element)) continue;

          // GK sub: bench pos 12 can only replace a GK
          if (benchPlayer.position === 12) {
            if (starter.elementType !== 1) continue;
          }
          // Non-GK bench can't replace into GK slot if there's no formation issue
          if (starter.elementType === 1 && benchPlayer.position !== 12) continue;

          // Check formation validity after proposed swap
          const proposedXI = starters
            .filter((s) => s.element !== starter.element && !subsOut.includes(s.element))
            .concat(
              subsIn
                .map((id) => bench.find((b) => b.element === id)!)
                .filter(Boolean),
            )
            .concat([benchPlayer]);

          if (
            isValidFormation(
              proposedXI.map((p) => ({
                element: p.element,
                elementType: p.elementType,
              })),
            )
          ) {
            subsOut.push(starter.element);
            subsIn.push(benchPlayer.element);
            break;
          }
        }
      }
    }

    // Build final XI
    const finalXI = isBenchBoost
      ? playerData
      : [
          ...starters.filter((s) => !subsOut.includes(s.element)),
          ...bench.filter((b) => subsIn.includes(b.element)),
        ];

    const finalBench = isBenchBoost
      ? []
      : bench.filter((b) => !subsIn.includes(b.element));

    // Captain logic
    const captainInXI = finalXI.find((p) => p.element === captainElement);
    const viceCaptainInXI = finalXI.find(
      (p) => p.element === viceCaptainElement,
    );

    const captainPlayed = (captainInXI?.minutes ?? 0) > 0;
    const viceCaptainPlayed = (viceCaptainInXI?.minutes ?? 0) > 0;

    const multiplier = isTripleCaptain ? 3 : 2;

    let score = finalXI.reduce((sum, p) => sum + p.totalPoints, 0);

    // Apply captain multiplier (add the bonus portion only)
    if (captainPlayed && captainInXI) {
      score += captainInXI.totalPoints * (multiplier - 1);
    } else if (viceCaptainPlayed && viceCaptainInXI) {
      score += viceCaptainInXI.totalPoints * (multiplier - 1);
    }

    const actual = actualScores.get(gw);

    gameweeks.push({
      event: gw,
      noTransferScore: score,
      actualScore: (actual?.points ?? 0) - (actual?.transferCost ?? 0),
      averageScore: 0,
      transferCost: actual?.transferCost ?? 0,
      chipUsed: chip,
      details: {
        starting: finalXI.map((p) => ({
          element: p.element,
          points: p.totalPoints,
          minutes: p.minutes,
        })),
        bench: finalBench.map((p) => ({
          element: p.element,
          points: p.totalPoints,
          minutes: p.minutes,
        })),
        captainElement,
        captainPlayed,
        viceCaptainElement,
        viceCaptainPlayed,
        subsIn,
        subsOut,
      },
    });
  }

  const noTransferTotal = gameweeks.reduce(
    (s, gw) => s + gw.noTransferScore,
    0,
  );
  const actualTotal = gameweeks.reduce((s, gw) => s + gw.actualScore, 0);
  const totalTransferCost = gameweeks.reduce(
    (s, gw) => s + gw.transferCost,
    0,
  );

  return {
    gw1Players,
    gameweeks,
    totals: {
      noTransferTotal,
      actualTotal,
      difference: noTransferTotal - actualTotal,
      totalTransferCost,
    },
  };
}
