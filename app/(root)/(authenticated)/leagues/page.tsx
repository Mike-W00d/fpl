import { Suspense } from "react";
import Link from "next/link";
import { requireFplAccount } from "@/lib/auth/require-fpl-account";

async function LeaguesContent() {
  const { user, supabase } = await requireFplAccount();

  const { data: accounts } = await supabase
    .from("fpl_accounts")
    .select("id")
    .eq("user_id", user.id);

  const accountIds = accounts?.map((a) => a.id) ?? [];

  const { data: leagueRows } = await supabase
    .from("fpl_account_leagues")
    .select("league_id, current_rank, leagues(league_id, name, total_entrants)")
    .in("fpl_account_id", accountIds);

  // Deduplicate leagues across accounts — keep the best (lowest) rank
  const leagueMap = new Map<
    number,
    { league_id: number; name: string; total_entrants: number; current_rank: number | null }
  >();

  for (const row of leagueRows ?? []) {
    const l = row.leagues;
    const league = Array.isArray(l) ? l[0] : l;
    if (!league) continue;

    const existing = leagueMap.get(league.league_id);
    if (
      !existing ||
      (row.current_rank !== null &&
        (existing.current_rank === null || row.current_rank < existing.current_rank))
    ) {
      leagueMap.set(league.league_id, { ...league, current_rank: row.current_rank });
    }
  }

  const leagues = Array.from(leagueMap.values());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-1">My Leagues</h1>
      <p className="text-muted-foreground mb-8">
        Classic and head-to-head leagues linked to your FPL account.
      </p>

      {leagues.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No leagues found. Leagues will appear here once your FPL account data
          has been synced.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg p-4 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs uppercase tracking-wide text-muted-foreground py-3 pr-4">
                  League Name
                </th>
                <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 px-4 tabular-nums">
                  Entrants
                </th>
                <th className="text-right text-xs uppercase tracking-wide text-muted-foreground py-3 pl-4 tabular-nums">
                  Rank
                </th>
              </tr>
            </thead>
            <tbody>
              {leagues.map((league) => (
                <tr
                  key={league.league_id}
                  className="border-b last:border-0 even:bg-muted/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-0 pr-4">
                    <Link
                      href={`/leagues/${league.league_id}`}
                      className="font-medium block py-3"
                    >
                      {league.name}
                    </Link>
                  </td>
                  <td className="py-0 px-4 text-right tabular-nums">
                    <Link
                      href={`/leagues/${league.league_id}`}
                      className="block py-3"
                    >
                      {league.total_entrants.toLocaleString()}
                    </Link>
                  </td>
                  <td className="py-0 pl-4 text-right tabular-nums">
                    <Link
                      href={`/leagues/${league.league_id}`}
                      className="block py-3"
                    >
                      {league.current_rank
                        ? `#${league.current_rank.toLocaleString()}`
                        : <span className="text-muted-foreground">&mdash;</span>}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LeaguesSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
      <div className="h-5 w-80 bg-muted animate-pulse rounded mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}

export default function LeaguesPage() {
  return (
    <Suspense fallback={<LeaguesSkeleton />}>
      <LeaguesContent />
    </Suspense>
  );
}
