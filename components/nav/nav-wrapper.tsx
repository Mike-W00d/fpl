import { createClient } from "@/lib/supabase/server";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { DesktopTopNav } from "./desktop-top-nav";

export async function NavWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  return (
    <>
      <DesktopTopNav isAuthenticated={isAuthenticated} />
      <MobileBottomNav isAuthenticated={isAuthenticated} />
    </>
  );
}
