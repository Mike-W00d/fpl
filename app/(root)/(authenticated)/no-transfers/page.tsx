import { Suspense } from "react";
import { requireFplAccount } from "@/lib/auth/require-fpl-account";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreSummaryCards } from "./_components/score-summary-cards";
import { NoTransferTable } from "./_components/no-transfer-table";
import { AccountSelector } from "./_components/account-selector";
import { fetchNoTransferData } from "@/lib/fpl/no-transfer-data";
import { cn } from "@/lib/utils";

const posLabels: Record<number, string> = {
  1: "GKP",
  2: "DEF",
  3: "MID",
  4: "FWD",
};

const posOrder = [1, 2, 3, 4];

async function NoTransferContent({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { supabase, user } = await requireFplAccount();
  const params = await searchParams;

  const { data: accounts } = await supabase
    .from("fpl_accounts")
    .select("fpl_team_id, player_name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const teamParam = params?.team ? Number(params.team) : null;
  const selectedAccount =
    accounts?.find((a) => a.fpl_team_id === teamParam) ?? accounts?.[0];
  const teamId = selectedAccount?.fpl_team_id;

  if (!teamId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-muted-foreground">
          No FPL account linked. Go to your account page to link one.
        </p>
      </div>
    );
  }

  let data;
  try {
    data = await fetchNoTransferData(String(teamId));
  } catch (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          No Transfers
        </h1>
        <p className="text-fpl-negative">
          {error instanceof Error
            ? error.message
            : "Failed to load no-transfer data."}
        </p>
      </div>
    );
  }

  const gwsWon = data.gameweeks.filter(
    (gw) => gw.actualScore > gw.noTransferScore,
  ).length;
  const gwsLost = data.gameweeks.filter(
    (gw) => gw.actualScore < gw.noTransferScore,
  ).length;
  const gwsBeatAverage = data.gameweeks.filter(
    (gw) => gw.noTransferScore > gw.averageScore,
  ).length;

  const diff = data.totals.difference;
  // difference = noTransferTotal - actualTotal
  // positive diff = GW1 team was better (transfers cost you points)
  // negative diff = transfers helped
  const absDiff = Math.abs(diff);

  const starters = data.gw1Players
    .filter((p) => p.position <= 11)
    .sort((a, b) => a.elementType - b.elementType || a.position - b.position);
  const bench = data.gw1Players
    .filter((p) => p.position > 11)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">No Transfers</h1>
        {accounts && accounts.length > 1 && (
          <AccountSelector accounts={accounts} selectedTeamId={teamId!} />
        )}
      </div>
      <p className="mt-1 text-muted-foreground">
        What if you never made a single transfer from your GW1 team?
      </p>
      {diff !== 0 && (
        <p
          className={cn(
            "mt-2 text-xl font-semibold",
            diff > 0 ? "text-fpl-negative" : "text-fpl-positive",
          )}
        >
          {diff > 0
            ? `You'd be ${absDiff} points better off without transfers`
            : `Your transfers gained you ${absDiff} points`}
        </p>
      )}

      <div className="mt-8 space-y-8">
        <ScoreSummaryCards
          actualTotal={data.totals.actualTotal}
          noTransferTotal={data.totals.noTransferTotal}
          difference={data.totals.difference}
          totalTransferCost={data.totals.totalTransferCost}
          gwsWon={gwsWon}
          gwsLost={gwsLost}
          gwsBeatAverage={gwsBeatAverage}
        />

        <NoTransferTable
          gameweeks={data.gameweeks}
          gw1Players={data.gw1Players}
        />

        <Card>
          <CardHeader>
            <CardTitle>GW1 Squad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Starting XI */}
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Starting XI
              </h4>
              <div className="space-y-3">
                {posOrder.map((posType) => {
                  const players = starters.filter(
                    (p) => p.elementType === posType,
                  );
                  if (players.length === 0) return null;
                  return (
                    <div key={posType}>
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                        {posLabels[posType]}
                      </p>
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                        {players.map((p) => (
                          <div
                            key={p.element}
                            className="flex items-center justify-between rounded px-2 py-1 text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="w-10 justify-center text-[10px]"
                              >
                                {posLabels[p.elementType] ?? "???"}
                              </Badge>
                              <span className="font-medium">{p.webName}</span>
                              {p.isCaptain && (
                                <Badge
                                  variant="secondary"
                                  className="px-1 py-0 text-[10px]"
                                >
                                  C
                                </Badge>
                              )}
                              {p.isViceCaptain && (
                                <Badge
                                  variant="secondary"
                                  className="px-1 py-0 text-[10px]"
                                >
                                  VC
                                </Badge>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Bench */}
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Bench
              </h4>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {bench.map((p) => (
                  <div
                    key={p.element}
                    className="flex items-center justify-between rounded px-2 py-1 text-sm text-muted-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="w-10 justify-center text-[10px]"
                      >
                        {posLabels[p.elementType] ?? "???"}
                      </Badge>
                      <span className="font-medium">{p.webName}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NoTransferSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mb-2 h-5 w-80 animate-pulse rounded bg-muted" />
      <div className="mb-8 h-6 w-64 animate-pulse rounded bg-muted" />

      {/* Primary cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-6">
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Secondary cards skeleton */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4">
            <div className="mb-2 h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-7 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="mt-8 rounded-lg border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b px-3 py-3"
          >
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            <div className="h-4 w-10 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function NoTransfersPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  return (
    <Suspense fallback={<NoTransferSkeleton />}>
      <NoTransferContent searchParams={searchParams} />
    </Suspense>
  );
}
