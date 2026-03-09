"use client";

import { useCallback, useEffect, useState } from "react";
import { Lock, Trophy } from "lucide-react";
import type { StandingResult } from "@/lib/zod/schemas/leagueStandings";
import type { EntryHistory } from "@/lib/zod/schemas/entryHistory";
import type { AwardResult } from "@/lib/awards/types";
import { computeAwards } from "@/lib/awards/compute";
import { getAwardImageUrl } from "@/lib/awards/image-url";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AwardsSlideshow from "./awards-slideshow";

type EntryWithHistory = {
  entry: number;
  entry_name: string;
  player_name: string;
  history: EntryHistory;
};

type ApiResponse = {
  league: { id: number; name: string };
  entries: EntryWithHistory[];
  failed: number[];
};

export default function AwardsSection({
  leagueId,
  standings,
}: {
  leagueId: string;
  standings: StandingResult[];
}) {
  const [awards, setAwards] = useState<AwardResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState<number | null>(null);
  const [seenAwardIds, setSeenAwardIds] = useState<Set<string>>(new Set());

  const storageKey = `fpl-awards-seen-${leagueId}`;

  // Hydrate seen awards from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
          setSeenAwardIds(new Set(parsed as string[]));
        }
      }
    } catch {
      // Ignore malformed data
    }
  }, [storageKey]);

  const handleSeen = useCallback(
    (awardId: string) => {
      setSeenAwardIds((prev) => {
        if (prev.has(awardId)) return prev;
        const next = new Set(prev);
        next.add(awardId);
        localStorage.setItem(storageKey, JSON.stringify([...next]));
        return next;
      });
    },
    [storageKey],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAndCompute() {
      try {
        const res = await fetch(
          `/api/fpl/league-entry-histories?leagueId=${leagueId}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch league data");

        const data: ApiResponse = await res.json();
        const results = computeAwards({ entries: data.entries });
        setAwards(results);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Failed to load awards data");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchAndCompute();
    return () => controller.abort();
  }, [leagueId]);

  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-muted-foreground text-sm py-12 text-center">
        {error}
      </p>
    );
  }

  if (awards.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-12 text-center">
        Not enough data to compute awards yet.
      </p>
    );
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="flex justify-center">
          <Button onClick={() => setSlideshowStartIndex(0)} className="gap-2">
            <Trophy size={16} />
            View Awards
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {awards.map((award) => {
            const seen = seenAwardIds.has(award.id);
            return (
              <Card
                key={award.id}
                className={`p-3 flex flex-col items-center text-center gap-1 hover:bg-accent/50 transition-colors cursor-pointer ${
                  !seen ? "opacity-75" : ""
                }`}
                onClick={() => {
                  const allSeen = awards.every((a) => seenAwardIds.has(a.id));
                  if (allSeen && seen) {
                    setSlideshowStartIndex(awards.findIndex((a) => a.id === award.id));
                  } else {
                    setSlideshowStartIndex(0);
                  }
                }}
              >
                {award.image ? (
                  <img
                    src={getAwardImageUrl(award.image)}
                    alt={award.name}
                    className="w-12 h-12 object-cover"
                  />
                ) : (
                  <span className="text-2xl">{award.emoji}</span>
                )}
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                  {award.name}
                </p>
                {seen ? (
                  <>
                    <p className="text-sm font-semibold truncate w-full">
                      {award.winner.entry_name}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {award.heroStat} {award.statLabel}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                      <Lock size={12} />
                      ???
                    </p>
                    <p className="text-xs text-muted-foreground/50 blur-[2px] select-none tabular-nums">
                      00.0 hidden
                    </p>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {slideshowStartIndex !== null && (
        <AwardsSlideshow
          awards={awards}
          onClose={() => setSlideshowStartIndex(null)}
          onSeen={handleSeen}
          initialSlide={slideshowStartIndex}
        />
      )}
    </>
  );
}
