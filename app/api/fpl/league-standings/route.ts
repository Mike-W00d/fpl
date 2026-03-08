import { NextRequest, NextResponse } from "next/server";
import { validate } from "@/lib/zod/validation";

export async function GET(request: NextRequest) {
  const leagueId = request.nextUrl.searchParams.get("leagueId");

  if (!leagueId || !/^\d+$/.test(leagueId)) {
    return NextResponse.json(
      { error: "A valid numeric League ID is required" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=1&phase=1`,
  );

  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json(
        { error: "FPL league not found. Check the League ID and try again." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch league data from FPL" },
      { status: 502 },
    );
  }

  const data = await res.json();

  try {
    const standings = validate("leagueStandings", data);
    return NextResponse.json(standings);
  } catch {
    return NextResponse.json(
      { error: "Unexpected response format from FPL API" },
      { status: 502 },
    );
  }
}
