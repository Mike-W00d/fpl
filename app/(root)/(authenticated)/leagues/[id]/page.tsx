import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireFplAccount } from "@/lib/auth/require-fpl-account";
import { validate } from "@/lib/zod/validation";
import type { StandingResult } from "@/lib/zod/schemas/leagueStandings";
import LeagueTabs from "./_components/league-tabs";

async function LeagueContent({ id }: { id: string }) {
  const { supabase } = await requireFplAccount();

  const { data: league, error: leagueError } = await supabase
    .from("leagues")
    .select("league_id, name, total_entrants, scoring_type")
    .eq("league_id", Number(id))
    .single();

  if (leagueError || !league) {
    notFound();
  }

  const { data: latestGw } = await supabase
    .from("gameweek_stats")
    .select("gameweek_number")
    .order("gameweek_number", { ascending: false })
    .limit(1)
    .single();

  let standings: StandingResult[] = [];
  let leagueName = league.name;
  let fetchError = false;

  try {
    const res = await fetch(
      `https://fantasy.premierleague.com/api/leagues-classic/${id}/standings/?page_standings=1&phase=1`,
      { signal: AbortSignal.timeout(10_000) },
    );

    if (res.ok) {
      const data = await res.json();
      const validated = validate("leagueStandings", data);
      standings = validated.standings.results;
      leagueName = validated.league.name;
    } else {
      fetchError = true;
    }
  } catch {
    fetchError = true;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 md:py-12 flex flex-col h-[calc(100dvh-4rem)] md:h-auto">
      <h1 className="text-lg md:text-3xl font-bold tracking-tight mb-1">{leagueName}</h1>
      <p className="text-muted-foreground text-xs md:text-base mb-4 md:mb-8">
        {league.total_entrants.toLocaleString()} entrants
      </p>

      {fetchError ? (
        <p className="text-muted-foreground text-sm">
          Unable to load standings from FPL right now. Try again later.
        </p>
      ) : standings.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No standings available yet.
        </p>
      ) : (
        <LeagueTabs standings={standings} leagueId={id} totalEntrants={league.total_entrants} currentGameweek={latestGw?.gameweek_number} />
      )}
    </div>
  );
}

function LeagueSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 md:py-12 flex flex-col h-[calc(100dvh-4rem)] md:h-auto">
      <div className="h-6 md:h-8 w-48 md:w-64 bg-muted animate-pulse rounded mb-2" />
      <div className="h-4 md:h-5 w-32 md:w-40 bg-muted animate-pulse rounded mb-4 md:mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<LeagueSkeleton />}>
      <LeagueContent id={id} />
    </Suspense>
  );
}
