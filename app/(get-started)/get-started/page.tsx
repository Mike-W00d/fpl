import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FplTeamForm } from "./_components/fpl-team-form";

async function GetStartedContent() {
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

  // If user already has an FPL account, send them to my-leagues
  if (accounts && accounts.length > 0) {
    redirect("/leagues");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Get Started</h1>
      <p className="text-muted-foreground mb-8">
        Link your FPL account to start tracking your season.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Connect your FPL Team</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            Enter your FPL Team ID to get started. You can find this in the URL
            when viewing your team on the official FPL site.
          </p>
          <FplTeamForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-5 w-80 bg-muted animate-pulse rounded mb-8" />
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
        </div>
      }
    >
      <GetStartedContent />
    </Suspense>
  );
}
