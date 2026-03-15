import { NextRequest, NextResponse } from "next/server";
import { fetchNoTransferData } from "@/lib/fpl/no-transfer-data";

export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get("teamId");

  if (!teamId || !/^\d+$/.test(teamId) || Number(teamId) > 100_000_000) {
    return NextResponse.json(
      { error: "A valid numeric Team ID is required" },
      { status: 400 },
    );
  }

  try {
    const result = await fetchNoTransferData(teamId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("No-transfer score error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to calculate no-transfer score";

    const status = message.includes("not found") ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
