"use client";

import type { StandingResult } from "@/lib/zod/schemas/leagueStandings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameweekHistoryTable from "./gameweek-history-table";
import AwardsSection from "./awards-section";

const MAX_ENTRANTS_FOR_DETAIL = 50;

export default function LeagueTabs({
  standings,
  leagueId,
  totalEntrants,
  currentGameweek,
}: {
  standings: StandingResult[];
  leagueId: string;
  totalEntrants: number;
  currentGameweek?: number;
}) {
  return (
    <Tabs defaultValue="classic" className="flex-1 flex flex-col min-h-0">
      <div className="sticky top-0 z-40 bg-background border-b">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="classic">Classic View</TabsTrigger>
          <TabsTrigger value="in-depth">In Depth</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="classic" className="flex-1 overflow-auto">
        <div className="overflow-x-auto shadow-md rounded-lg p-4 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 pr-2 tabular-nums w-8">
                  Pos
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4">
                  Team Name
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 max-w-[120px] sm:max-w-none truncate">
                  Manager
                </th>
                <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-2 sm:px-4 tabular-nums">
                  {currentGameweek ? `GW ${currentGameweek}` : "GW"}
                </th>
                <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 pl-2 sm:pl-4 tabular-nums">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b last:border-0 even:bg-muted/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-3 pr-2 text-left tabular-nums text-muted-foreground">
                    {entry.rank}
                  </td>
                  <td className="py-3 px-2 sm:px-4 font-medium">
                    {entry.entry_name}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-muted-foreground max-w-[120px] sm:max-w-none truncate">
                    {entry.player_name}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right tabular-nums">
                    {entry.event_total}
                  </td>
                  <td className="py-3 pl-2 sm:pl-4 text-right tabular-nums font-semibold">
                    {entry.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="in-depth" className="flex-1 overflow-auto p-4">
        {totalEntrants > MAX_ENTRANTS_FOR_DETAIL ? (
          <p className="text-muted-foreground text-sm py-12 text-center">
            In-depth stats are only available for leagues with {MAX_ENTRANTS_FOR_DETAIL} or fewer members.
          </p>
        ) : (
          <GameweekHistoryTable leagueId={leagueId} standings={standings} />
        )}
      </TabsContent>

      <TabsContent value="awards" className="flex-1 overflow-auto">
        {totalEntrants > MAX_ENTRANTS_FOR_DETAIL ? (
          <p className="text-muted-foreground text-sm py-12 text-center">
            Awards are only available for leagues with {MAX_ENTRANTS_FOR_DETAIL} or fewer members.
          </p>
        ) : (
          <AwardsSection leagueId={leagueId} standings={standings} />
        )}
      </TabsContent>
    </Tabs>
  );
}
