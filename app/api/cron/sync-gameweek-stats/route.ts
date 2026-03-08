import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { validate } from "@/lib/zod/validation";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `FPL API returned ${res.status}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const parsed = validate("bootstrapStatic", data);

    const finishedEvents = parsed.events.filter(
      (event) => event.finished && event.data_checked,
    );

    const rows = finishedEvents.map((event) => {
      const topChip = event.chip_plays.length
        ? event.chip_plays.sort((a, b) => b.num_played - a.num_played)[0]
        : null;

      return {
        gameweek_number: event.id,
        highest_score: event.highest_score ?? 0,
        average_score: event.average_entry_score,
        most_played_chip: topChip?.chip_name ?? null,
        chip_played_amount: topChip?.num_played ?? null,
      };
    });

    if (rows.length === 0) {
      return NextResponse.json({ message: "No finished gameweeks to sync" });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("gameweek_stats")
      .upsert(rows, { onConflict: "gameweek_number" });

    if (error) {
      return NextResponse.json(
        { error: `Supabase upsert failed: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: `Synced ${rows.length} gameweek(s)`,
      gameweeks: rows.map((r) => r.gameweek_number),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
