"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GameweekResult, Gw1Player } from "@/lib/fpl/no-transfer-engine";

interface NoTransferTableProps {
  gameweeks: GameweekResult[];
  gw1Players: Gw1Player[];
}

const chipLabels: Record<string, { short: string; full: string }> = {
  bboost: { short: "BB", full: "Bench Boost" },
  "3xc": { short: "TC", full: "Triple Captain" },
  freehit: { short: "FH", full: "Free Hit" },
  wildcard: { short: "WC", full: "Wildcard" },
};

const posLabels: Record<number, string> = {
  1: "GKP",
  2: "DEF",
  3: "MID",
  4: "FWD",
};

export function NoTransferTable({
  gameweeks,
  gw1Players,
}: NoTransferTableProps) {
  const [expandedGw, setExpandedGw] = useState<number | null>(null);

  const playerMap = new Map(gw1Players.map((p) => [p.element, p]));

  let cumulativeNt = 0;
  let cumulativeActual = 0;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-2 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-3">
              GW
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-3">
              <span className="sm:hidden">NT Pts</span>
              <span className="hidden sm:inline">No Transfer Points</span>
            </th>
            <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Actual
            </th>
            <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Diff
            </th>
            <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span className="sm:hidden">Avg</span>
              <span className="hidden sm:inline">GW Avg</span>
            </th>
            <th className="hidden px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">
              Cum. NT
            </th>
            <th className="hidden px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground sm:table-cell">
              Cum. Actual
            </th>
          </tr>
        </thead>
        <tbody>
          {gameweeks.map((gw) => {
            cumulativeNt += gw.noTransferScore;
            cumulativeActual += gw.actualScore;
            const diff = gw.noTransferScore - gw.actualScore;
            const isExpanded = expandedGw === gw.event;

            return (
              <GwRow
                key={gw.event}
                gw={gw}
                diff={diff}
                cumulativeNt={cumulativeNt}
                cumulativeActual={cumulativeActual}
                isExpanded={isExpanded}
                onToggle={() =>
                  setExpandedGw(isExpanded ? null : gw.event)
                }
                playerMap={playerMap}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GwRow({
  gw,
  diff,
  cumulativeNt,
  cumulativeActual,
  isExpanded,
  onToggle,
  playerMap,
}: {
  gw: GameweekResult;
  diff: number;
  cumulativeNt: number;
  cumulativeActual: number;
  isExpanded: boolean;
  onToggle: () => void;
  playerMap: Map<number, Gw1Player>;
}) {
  const cumulativeDiff = cumulativeActual - cumulativeNt;

  return (
    <>
      <tr
        className="cursor-pointer border-b transition-colors hover:bg-accent/50 even:bg-muted/30"
        onClick={onToggle}
      >
        <td className="px-2 py-2 text-left font-medium sm:px-3">
          <span className="inline-flex items-center justify-center gap-1">
            {isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
            {gw.event}
            {gw.chipUsed && (
              <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                <span className="sm:hidden">
                  {chipLabels[gw.chipUsed]?.short ?? gw.chipUsed}
                </span>
                <span className="hidden sm:inline">
                  {chipLabels[gw.chipUsed]?.full ?? gw.chipUsed}
                </span>
              </Badge>
            )}
          </span>
        </td>
        <td className="px-2 py-2 text-center font-semibold tabular-nums sm:px-3">
          {gw.noTransferScore}
        </td>
        <td className="px-3 py-2 text-center tabular-nums">
          {gw.actualScore}
          {gw.transferCost > 0 && (
            <span className="ml-1 text-xs text-fpl-negative">
              (-{gw.transferCost})
            </span>
          )}
        </td>
        <td
          className={cn(
            "px-3 py-2 text-center font-semibold tabular-nums",
            diff > 0 && "text-fpl-positive",
            diff < 0 && "text-fpl-negative",
          )}
        >
          <span className="inline-flex items-center justify-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                cumulativeDiff > 0 && "bg-fpl-positive",
                cumulativeDiff < 0 && "bg-fpl-negative",
                cumulativeDiff === 0 && "bg-muted-foreground",
              )}
            />
            {diff > 0 ? "+" : ""}
            {diff}
          </span>
        </td>
        <td className="px-3 py-2 text-center tabular-nums text-muted-foreground">
          {gw.averageScore}
        </td>
        <td className="hidden px-3 py-2 text-center tabular-nums sm:table-cell">
          {cumulativeNt}
        </td>
        <td className="hidden px-3 py-2 text-center tabular-nums sm:table-cell">
          {cumulativeActual}
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b">
          <td colSpan={7} className="bg-muted/40 px-3 py-3">
            <div className="rounded-md bg-background/50 p-3">
              <ExpandedGwDetails gw={gw} playerMap={playerMap} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ExpandedGwDetails({
  gw,
  playerMap,
}: {
  gw: GameweekResult;
  playerMap: Map<number, Gw1Player>;
}) {
  const { details } = gw;

  const startingTotal = details.starting.reduce(
    (sum, p) => sum + p.points,
    0,
  );

  const captainPlayer = playerMap.get(details.captainElement);
  const viceCaptainPlayer = playerMap.get(details.viceCaptainElement);
  const effectiveCaptain = details.captainPlayed
    ? captainPlayer
    : details.viceCaptainPlayed
      ? viceCaptainPlayer
      : null;

  return (
    <div className="space-y-3">
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Starting XI
        </h4>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {details.starting.map((p) => {
            const player = playerMap.get(p.element);
            const isCaptain =
              p.element === details.captainElement && details.captainPlayed;
            const isViceCaptain =
              p.element === details.viceCaptainElement &&
              !details.captainPlayed &&
              details.viceCaptainPlayed;
            const isSubIn = details.subsIn.includes(p.element);

            return (
              <div
                key={p.element}
                className="flex items-center justify-between rounded px-2 py-1 text-sm"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-8 text-[10px] text-muted-foreground">
                    {posLabels[player?.elementType ?? 0] ?? "???"}
                  </span>
                  <span className={cn(isSubIn && "text-fpl-positive")}>
                    {player?.webName ?? `#${p.element}`}
                  </span>
                  {(isCaptain || isViceCaptain) && (
                    <Badge
                      variant="outline"
                      className="px-1 py-0 text-[10px]"
                    >
                      {isCaptain ? "C" : "VC"}
                    </Badge>
                  )}
                  {isSubIn && (
                    <span className="text-[10px] text-fpl-positive">
                      SUB IN
                    </span>
                  )}
                </span>
                <span className="font-semibold tabular-nums">{p.points}</span>
              </div>
            );
          })}
        </div>

        {/* Starting XI total */}
        <div className="mt-1 flex items-center justify-between border-t px-2 py-1.5 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            Total
            {effectiveCaptain && (
              <span className="text-xs">
                &middot; Captain: {effectiveCaptain.webName} (2&times;)
              </span>
            )}
          </span>
          <span className="font-bold tabular-nums">{startingTotal}</span>
        </div>
      </div>

      {details.bench.length > 0 && (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bench
          </h4>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {details.bench.map((p) => {
              const player = playerMap.get(p.element);
              const isSubOut = details.subsOut.includes(p.element);

              return (
                <div
                  key={p.element}
                  className="flex items-center justify-between rounded px-2 py-1 text-sm text-muted-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-8 text-[10px]">
                      {posLabels[player?.elementType ?? 0] ?? "???"}
                    </span>
                    <span>{player?.webName ?? `#${p.element}`}</span>
                    {isSubOut && (
                      <span className="text-[10px] text-fpl-negative">
                        SUB OUT
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums">{p.points}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
