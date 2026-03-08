import { Suspense } from "react";
import Link from "next/link";
import { requireFplAccount } from "@/lib/auth/require-fpl-account";

async function LeaguesContent() {
  const { user, supabase } = await requireFplAccount();

  const { data: accounts } = await supabase
    .from("fpl_accounts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  const { data: leagueRows } = await supabase
    .from("fpl_account_leagues")
    .select("league_id, current_rank, leagues(league_id, name, total_entrants)")
    .eq("fpl_account_id", accounts![0].id);

  const leagues =
    leagueRows
      ?.map((row) => {
        const l = row.leagues;
        // Supabase may type the join as array or object; normalise to object
        const league = Array.isArray(l) ? l[0] : l;
        return league ? { ...league, current_rank: row.current_rank } : null;
      })
      .filter(Boolean) ?? [];

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
        <div className="overflow-x-auto">
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
                  key={league!.league_id}
                  className="border-b last:border-0 even:bg-muted/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={`/leagues/${league!.league_id}`}
                      className="font-medium hover:underline"
                    >
                      {league!.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {league!.total_entrants.toLocaleString()}
                  </td>
                  <td className="py-3 pl-4 text-right tabular-nums">
                    {league!.current_rank
                      ? `#${league!.current_rank.toLocaleString()}`
                      : <span className="text-muted-foreground">&mdash;</span>}
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
