import { Suspense } from "react";
import { requireFplAccount } from "@/lib/auth/require-fpl-account";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function AccountContent() {
  const { user, supabase } = await requireFplAccount();

  const [{ data: account }, { data: profile }] = await Promise.all([
    supabase
      .from("fpl_accounts")
      .select("*")
      .eq("user_id", user.id)
      .single(),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);

  const details = [
    {
      label: "Display Name",
      value: profile?.display_name ?? "—",
    },
    {
      label: "Player Name",
      value: account?.player_name ?? "—",
    },
    {
      label: "FPL Team ID",
      value: account?.fpl_team_id,
    },
    {
      label: "Account Created",
      value: account?.created_at
        ? new Date(account.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-1">My Account</h1>
      <p className="text-muted-foreground mb-8">
        Your profile and linked FPL account details.
      </p>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="font-semibold tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
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
