import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Checks that the current user is authenticated and has at least one FPL account.
 * Redirects to /auth/login if not authenticated, or /get-started if no FPL account exists.
 */
export async function requireFplAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: accounts } = await supabase
    .from("fpl_accounts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (!accounts || accounts.length === 0) {
    redirect("/get-started");
  }

  return { user, supabase };
}
