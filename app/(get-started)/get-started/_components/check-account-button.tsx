"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CheckAccountButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAccount = async () => {
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not signed in");
      setLoading(false);
      return;
    }

    const { data, error: dbError } = await supabase
      .from("fpl_accounts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbError) {
      setError("Something went wrong");
      setLoading(false);
      return;
    }

    if (data) {
      router.push("/leagues");
    } else {
      setError("No FPL account connected");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button variant="outline" onClick={checkAccount} disabled={loading}>
        {loading ? "Checking…" : "Already connected?"}
      </Button>
    </div>
  );
}
