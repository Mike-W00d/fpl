import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FplTeamForm } from "@/components/fpl-team-form";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image"

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
            Enter your FPL Team ID to get started. Follow the steps below to
            find it.
          </p>

          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li>
              Go to the FPL website
              <Button variant="outline" size="sm" className="ml-2" asChild>
                <Link
                  href="https://fantasy.premierleague.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  fantasy.premierleague.com
                  <ExternalLink size={14} className="ml-1.5" />
                </Link>
              </Button>
            </li>
            <li>
              Navigate to the <span className="font-semibold">Points</span> page
            </li>
          </ol>

          <div className="max-w-md">
            <Image
              src="/FplNav.png"
              alt="FPL nav bar showing points page"
              width={1120}
              height={520}
              className="rounded-md border"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Look for &ldquo;Points&rdquo; in the navigation bar
            </p>
          </div>

          <ol start={3} className="list-decimal list-inside space-y-3 text-sm">
            <li>
              Copy the Team ID number from the URL
              <span className="block text-xs text-muted-foreground mt-1">
                e.g. fantasy.premierleague.com/entry/<span className="font-semibold text-foreground">123456</span>/event/1
              </span>
            </li>
          </ol>

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
