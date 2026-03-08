import { NextRequest, NextResponse } from "next/server";
import { validate } from "@/lib/zod/validation";

export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get("teamId");

  if (!teamId || !/^\d+$/.test(teamId)) {
    return NextResponse.json(
      { error: "A valid numeric Team ID is required" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://fantasy.premierleague.com/api/entry/${teamId}/`,
  );

  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json(
        { error: "FPL team not found. Check your Team ID and try again." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch team data from FPL" },
      { status: 502 },
    );
  }

  const data = await res.json();

  try {
    const entry = validate("entrySummary", data);
    return NextResponse.json(entry);
  } catch {
    return NextResponse.json(
      { error: "Unexpected response format from FPL API" },
      { status: 502 },
    );
  }
}
