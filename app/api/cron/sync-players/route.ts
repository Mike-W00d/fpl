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
      { next: { revalidate: 60 } },
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `FPL API returned ${res.status}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const parsed = validate("bootstrapStatic", data);

    const rows = parsed.elements.map((el) => ({
      element_id: el.id,
      web_name: el.web_name,
      element_type: el.element_type,
      updated_at: new Date().toISOString(),
    }));

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("players")
      .upsert(rows, { onConflict: "element_id" });

    if (error) {
      return NextResponse.json(
        { error: `Supabase upsert failed: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: `Synced ${rows.length} player(s)`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
