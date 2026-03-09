"use server";

import { createClient } from "@/lib/supabase/server";
import type { ClassicLeague } from "@/lib/zod/schemas/entrySummary";

export async function linkFplAccount(
  fplTeamId: number,
  playerName: string,
  classicLeagues: ClassicLeague[],
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to link an FPL account." };
  }

  const { data: fplAccount, error } = await supabase
    .from("fpl_accounts")
    .insert({ user_id: user.id, fpl_team_id: fplTeamId, player_name: playerName })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "This FPL team has already been registered." };
    }
    return { error: "Failed to link FPL account. Please try again." };
  }

  // Persist user-created leagues (league_type "x")
  const userLeagues = classicLeagues.filter((l) => l.league_type === "x");
  if (userLeagues.length > 0) {
    const rows = userLeagues.map((l) => ({
      league_id: l.id,
      name: l.name,
      total_entrants: l.rank_count,
      scoring_type: l.scoring,
    }));

    const { error: leagueError } = await supabase
      .from("leagues")
      .upsert(rows, { onConflict: "league_id" });

    if (leagueError) {
      console.error("Failed to insert leagues:", leagueError);
    } else {
      // Link the FPL account to each upserted league
      const junctionRows = userLeagues.map((l) => {
        const phase1 = l.active_phases.find((p) => p.phase === 1);
        return {
          fpl_account_id: fplAccount.id,
          league_id: l.id,
          current_rank: phase1?.rank ?? null,
          rank_last_updated: new Date().toISOString(),
        };
      });

      const { error: junctionError } = await supabase
        .from("fpl_account_leagues")
        .upsert(junctionRows, { onConflict: "fpl_account_id,league_id" });

      if (junctionError) {
        console.error("Failed to insert fpl_account_leagues:", junctionError);
      }
    }
  }

  return { success: true };
}
