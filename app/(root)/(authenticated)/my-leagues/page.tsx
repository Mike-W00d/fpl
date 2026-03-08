import { Suspense } from "react";
import { requireFplAccount } from "@/lib/auth/require-fpl-account";

async function MyLeaguesContent() {
  await requireFplAccount();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">My Leagues</h1>
      <p className="text-muted-foreground">
        Your FPL leagues will appear here.
      </p>
    </div>
  );
}

export default function MyLeaguesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-5 w-80 bg-muted animate-pulse rounded" />
        </div>
      }
    >
      <MyLeaguesContent />
    </Suspense>
  );
}
