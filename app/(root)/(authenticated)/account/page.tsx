import { Suspense } from "react";
import { requireFplAccount } from "@/lib/auth/require-fpl-account";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConnectAccountSection } from "./_components/connect-account-section";

async function AccountContent() {
  const { user, supabase } = await requireFplAccount();

  const [{ data: accounts }, { data: profile }] = await Promise.all([
    supabase
      .from("fpl_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-1">My Account</h1>
      <p className="text-muted-foreground mb-8">
        Your profile and linked FPL account details.
      </p>

      {profile && (
        <Card className="max-w-lg mb-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Display Name</dt>
              <dd className="font-semibold">{profile.display_name ?? "—"}</dd>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="text-xl font-semibold tracking-tight mb-4">
        Linked FPL Accounts
      </h2>

      <div className="flex flex-col gap-4 max-w-lg mb-6">
        {accounts && accounts.length > 0 ? (
          accounts.map((account) => (
            <Card key={account.id}>
              <CardContent className="pt-6">
                <dl className="space-y-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-muted-foreground">
                      Player Name
                    </dt>
                    <dd className="font-semibold">
                      {account.player_name ?? "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-muted-foreground">
                      FPL Team ID
                    </dt>
                    <dd className="font-semibold tabular-nums">
                      {account.fpl_team_id}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-muted-foreground">Linked</dt>
                    <dd className="text-sm tabular-nums">
                      {account.created_at
                        ? new Date(account.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No FPL accounts linked yet.
          </p>
        )}
      </div>

      <ConnectAccountSection />
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
      <div className="h-5 w-72 bg-muted animate-pulse rounded mb-8" />
      <div className="max-w-lg rounded-xl border p-6 space-y-4">
        <div className="h-5 w-36 bg-muted animate-pulse rounded mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 w-28 bg-muted animate-pulse rounded" />
            <div className="h-4 w-36 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountContent />
    </Suspense>
  );
}
