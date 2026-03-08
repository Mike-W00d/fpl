"use client";

import type { StandingResult } from "@/lib/zod/schemas/leagueStandings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameweekHistoryTable from "./gameweek-history-table";

export default function LeagueTabs({
  standings,
  leagueId,
}: {
  standings: StandingResult[];
  leagueId: string;
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 pr-4 tabular-nums w-16">
                  Rank
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 px-4">
                  Team Name
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 px-4">
                  Manager
                </th>
                <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-4 tabular-nums">
                  GW
                </th>
                <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 pl-4 tabular-nums">
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
                  <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                    {entry.rank}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {entry.entry_name}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {entry.player_name}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {entry.event_total}
                  </td>
                  <td className="py-3 pl-4 text-right tabular-nums font-semibold">
                    {entry.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="in-depth" className="flex-1 overflow-auto">
        <GameweekHistoryTable leagueId={leagueId} standings={standings} />
      </TabsContent>

      <TabsContent value="awards" className="flex-1 overflow-auto">
        <p className="text-muted-foreground text-sm py-12 text-center">
          Coming soon
        </p>
      </TabsContent>
    </Tabs>
  );
}
