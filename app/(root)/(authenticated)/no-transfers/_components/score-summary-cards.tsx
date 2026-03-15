import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScoreSummaryCardsProps {
  actualTotal: number;
  noTransferTotal: number;
  difference: number;
  totalTransferCost: number;
  gwsWon: number;
  gwsLost: number;
  gwsBeatAverage: number;
}

export function ScoreSummaryCards({
  actualTotal,
  noTransferTotal,
  difference,
  totalTransferCost,
  gwsWon,
  gwsLost,
  gwsBeatAverage,
}: ScoreSummaryCardsProps) {
  return (
    <div className="space-y-4">
      {/* Primary row — core comparison */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Actual Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tabular-nums">{actualTotal}</p>
            {totalTransferCost > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                incl. {totalTransferCost} pts in transfer costs
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              No Transfer Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tabular-nums">
              {noTransferTotal}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              GW1 team, no changes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Difference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                "text-4xl font-bold tabular-nums",
                difference > 0 && "text-fpl-negative",
                difference < 0 && "text-fpl-positive",
              )}
            >
              {difference > 0 ? "+" : ""}
              {difference}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {difference > 0
                ? "Your GW1 team outscored you"
                : difference < 0
                  ? "Your transfers paid off"
                  : "No difference"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary row — supporting stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              GWs Won
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-fpl-positive">
              {gwsWon}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Transfers beat GW1 team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              GWs Lost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-fpl-negative">
              {gwsLost}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              GW1 team outscored you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Beat Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{gwsBeatAverage}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              GWs where GW1 team beat avg
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
