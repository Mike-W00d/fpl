"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { EntrySummary } from "@/lib/zod/schemas/entrySummary";
import { linkFplAccount } from "../_actions/link-fpl-account";

export function FplTeamForm() {
  const [teamId, setTeamId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [entry, setEntry] = useState<EntrySummary | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEntry(null);

    try {
      const res = await fetch(
        `/api/fpl/entry-summary?teamId=${encodeURIComponent(teamId)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setEntry(data as EntrySummary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="teamId">FPL Team ID</Label>
            <img
              src="/signup-help.png"
              alt="Where to find your FPL Team ID"
              className="rounded-lg border"
            />
            <p className="text-sm text-muted-foreground">
              In this example, the Team ID would be <span className="font-semibold text-foreground">222445</span>
            </p>
            <Input
              id="teamId"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 123456"
              required
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Looking up team..." : "Find my team"}
          </Button>
        </div>
      </form>

      {entry && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Manager</span>
                <span className="font-semibold">
                  {entry.player_first_name} {entry.player_last_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Region</span>
                <span className="text-sm">{entry.player_region_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Overall Points
                </span>
                <span className="font-bold tabular-nums">
                  {entry.summary_overall_points.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Overall Rank
                </span>
                <span className="tabular-nums">
                  #{entry.summary_overall_rank.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {entry && (
        <Button
          className="w-full"
          disabled={isLinking}
          onClick={async () => {
            setIsLinking(true);
            setError(null);
            const playerName = `${entry.player_first_name} ${entry.player_last_name}`;
            const result = await linkFplAccount(entry.id, playerName, entry.leagues.classic);
            if ("error" in result) {
              setError(result.error ?? "An unexpected error occurred");
              setIsLinking(false);
            } else {
              router.push("/leagues");
            }
          }}
        >
          {isLinking ? "Linking account..." : "Link Account"}
        </Button>
      )}
    </div>
  );
}
