"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import type { StandingResult } from "@/lib/zod/schemas/leagueStandings";
import type { CurrentGameweek, EntryHistory } from "@/lib/zod/schemas/entryHistory";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EntryWithHistory = {
  entry: number;
  entry_name: string;
  player_name: string;
  history: EntryHistory;
};

type ApiResponse = {
  league: { id: number; name: string };
  entries: EntryWithHistory[];
  failed: number[];
};

function formatMoney(raw: number): string {
  return (raw / 10).toFixed(1);
}

export default function GameweekHistoryTable({
  leagueId,
  standings,
}: {
  leagueId: string;
  standings: StandingResult[];
}) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGw, setSelectedGw] = useState<number | "overall">("overall");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHistories() {
      try {
        const res = await fetch(
          `/api/fpl/league-entry-histories?leagueId=${leagueId}`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error ?? "Failed to load gameweek histories");
        }
        const json: ApiResponse = await res.json();
        setData(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchHistories();
    return () => controller.abort();
  }, [leagueId]);

  // Derive available gameweeks from first entry
  const availableGws: number[] =
    data && data.entries.length > 0
      ? data.entries[0].history.current.map((gw) => gw.event)
      : [];

  // Build rows
  const rows = buildRows(data, standings, selectedGw);

  if (error) {
    return (
      <p className="text-muted-foreground text-sm mt-8">
        Unable to load gameweek history: {error}
      </p>
    );
  }

  return (
    <div className="mt-4 md:mt-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold tracking-tight">Gameweek History</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Info size={16} />
                <span className="sr-only">Column definitions</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Column Definitions</DialogTitle>
              </DialogHeader>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="font-semibold">Pts</dt>
                <dd className="text-muted-foreground">Total points (overall) or gameweek points</dd>
                <dt className="font-semibold">GW Rank</dt>
                <dd className="text-muted-foreground">Rank among all FPL managers for that gameweek (for overall this is your latest rank)</dd>
                <dt className="font-semibold">OR</dt>
                <dd className="text-muted-foreground">Overall rank among all FPL managers</dd>
                <dt className="font-semibold">Bank</dt>
                <dd className="text-muted-foreground">Money remaining in the bank (£m) (for overall this is your average over the season)</dd>
                <dt className="font-semibold">Value</dt>
                <dd className="text-muted-foreground">Total squad value including bank (£m)</dd>
                <dt className="font-semibold">TM</dt>
                <dd className="text-muted-foreground">Transfers made</dd>
                <dt className="font-semibold">TC</dt>
                <dd className="text-muted-foreground">Transfer cost — points deducted for extra transfers</dd>
                <dt className="font-semibold">PoB</dt>
                <dd className="text-muted-foreground">Points left on the bench (not scored)</dd>
              </dl>
              <div className="border-t my-2" />
              <h3 className="text-sm font-semibold mt-1">Overall vs Gameweek View</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Allows you to rewind at look at the league table after each gameweek, see who has bottled it and see the stats for each week
              </p>
            </DialogContent>
          </Dialog>
        </div>
        <select
          value={selectedGw}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedGw(val === "overall" ? "overall" : Number(val));
          }}
          disabled={isLoading}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
        >
          <option value="overall">Overall</option>
          {availableGws.map((gw) => (
            <option key={gw} value={gw}>
              GW {gw}
            </option>
          ))}
        </select>
      </div>

      {data && data.failed.length > 0 && (
        <p className="text-muted-foreground text-xs mb-3">
          Could not load history for {data.failed.length} entrant
          {data.failed.length > 1 ? "s" : ""}.
        </p>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg p-4 bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 pr-2 tabular-nums w-8">
                Pos
              </th>
              <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4">
                Team
              </th>
              <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 max-w-[120px] sm:max-w-none truncate">
                Manager
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                Pts
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                GW Rank
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                OR
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                Bank
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                Value
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                TM
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                TC
              </th>
              <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 pl-2 sm:pl-4 tabular-nums">
                PoB
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: standings.length || 8 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td colSpan={11} className="py-3">
                      <div className="h-5 bg-muted animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              : rows.map((row, i) => (
                  <tr
                    key={row.entry}
                    className="border-b last:border-0 even:bg-muted/50 hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-3 pr-2 text-left tabular-nums text-muted-foreground">
                      {i + 1}
                    </td>
                    <td className="py-3 px-2 sm:px-4 font-medium">{row.entry_name}</td>
                    <td className="py-3 px-2 sm:px-4 text-muted-foreground max-w-[120px] sm:max-w-none truncate">
                      {row.player_name}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right tabular-nums font-semibold">
                      {row.total_points.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right tabular-nums">
                      {row.gw_rank?.toLocaleString() ?? "-"}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right tabular-nums">
                      {row.overall_rank.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right tabular-nums">
                      {formatMoney(row.bank)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right tabular-nums">
                      {formatMoney(row.value)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right tabular-nums">
                      {row.transfers}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-right tabular-nums">
                      {row.transfer_cost > 0 ? `-${row.transfer_cost}` : 0}
                    </td>
                    <td className="py-3 pl-2 sm:pl-4 text-right tabular-nums">
                      {row.points_on_bench}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Row = {
  entry: number;
  entry_name: string;
  player_name: string;
  total_points: number;
  gw_rank: number | null;
  overall_rank: number;
  bank: number;
  value: number;
  transfers: number;
  transfer_cost: number;
  points_on_bench: number;
};

function buildRows(
  data: ApiResponse | null,
  standings: StandingResult[],
  selectedGw: number | "overall",
): Row[] {
  if (!data) return [];

  if (selectedGw === "overall") {
    // Use league rank ordering from standings
    const rankMap = new Map<number, number>();
    standings.forEach((s) => rankMap.set(s.entry, s.rank));

    return data.entries
      .map((e) => {
        const current = e.history.current;
        const latest = current[current.length - 1];
        return {
          entry: e.entry,
          entry_name: e.entry_name,
          player_name: e.player_name,
          total_points: latest?.total_points ?? 0,
          gw_rank: latest?.rank ?? null,
          overall_rank: latest?.overall_rank ?? 0,
          bank: current.length > 0
            ? Math.round(sum(current, (gw) => gw.bank) / current.length)
            : 0,
          value: latest?.value ?? 0,
          transfers: sum(current, (gw) => gw.event_transfers),
          transfer_cost: sum(current, (gw) => gw.event_transfers_cost),
          points_on_bench: sum(current, (gw) => gw.points_on_bench),
        };
      })
      .sort((a, b) => {
        const rankA = rankMap.get(a.entry) ?? Infinity;
        const rankB = rankMap.get(b.entry) ?? Infinity;
        return rankA - rankB;
      });
  }

  // Individual GW view — sort by that GW's points desc
  return data.entries
    .map((e) => {
      const gw = e.history.current.find((g) => g.event === selectedGw);
      return {
        entry: e.entry,
        entry_name: e.entry_name,
        player_name: e.player_name,
        total_points: gw?.total_points ?? 0,
        gw_rank: gw?.rank ?? null,
        overall_rank: gw?.overall_rank ?? 0,
        bank: gw?.bank ?? 0,
        value: gw?.value ?? 0,
        transfers: gw?.event_transfers ?? 0,
        transfer_cost: gw?.event_transfers_cost ?? 0,
        points_on_bench: gw?.points_on_bench ?? 0,
      };
    })
    .sort((a, b) => b.total_points - a.total_points);
}

function sum(
  items: CurrentGameweek[],
  accessor: (item: CurrentGameweek) => number,
): number {
  return items.reduce((acc, item) => acc + accessor(item), 0);
}
