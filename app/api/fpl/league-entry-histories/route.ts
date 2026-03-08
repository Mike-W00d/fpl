import { NextRequest, NextResponse } from "next/server";
import { validate } from "@/lib/zod/validation";

export async function GET(request: NextRequest) {
  const leagueId = request.nextUrl.searchParams.get("leagueId");
  const page = request.nextUrl.searchParams.get("page") ?? "1";

  if (!leagueId || !/^\d+$/.test(leagueId)) {
    return NextResponse.json(
      { error: "A valid numeric leagueId is required" },
      { status: 400 },
    );
  }

  if (!/^\d+$/.test(page)) {
    return NextResponse.json(
      { error: "page must be a positive integer" },
      { status: 400 },
    );
  }

  // Step 1: Fetch league standings
  const standingsRes = await fetch(
    `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=${page}&phase=1`,
    { next: { revalidate: 300 } },
  );

  if (!standingsRes.ok) {
    if (standingsRes.status === 404) {
      return NextResponse.json(
        { error: "League not found. Check your league ID and try again." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch league standings from FPL" },
      { status: 502 },
    );
  }

  const standingsData = await standingsRes.json();

  let standings;
  try {
    standings = validate("leagueStandings", standingsData);
  } catch {
    return NextResponse.json(
      { error: "Unexpected response format from FPL API" },
      { status: 502 },
    );
  }

  // Step 2: Extract entry IDs and metadata
  const results = standings.standings.results;

  // Step 3: Fetch all entry histories in parallel
  const historyPromises = results.map(async (result) => {
    const res = await fetch(
      `https://fantasy.premierleague.com/api/entry/${result.entry}/history/`,
      { next: { revalidate: 300 } },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch history for entry ${result.entry}`);
    }

    const data = await res.json();
    return {
      entry: result.entry,
      entry_name: result.entry_name,
      player_name: result.player_name,
      history: validate("entryHistory", data),
    };
  });

  const settled = await Promise.allSettled(historyPromises);

  const entries: {
    entry: number;
    entry_name: string;
    player_name: string;
    history: ReturnType<typeof validate<"entryHistory">>;
  }[] = [];
  const failed: number[] = [];

  settled.forEach((result, index) => {
    if (result.status === "fulfilled") {
      entries.push(result.value);
    } else {
      failed.push(results[index].entry);
    }
  });

  return NextResponse.json({
    league: { id: standings.league.id, name: standings.league.name },
    entries,
    failed,
  });
}
