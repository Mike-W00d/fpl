// https://fantasy.premierleague.com/api/entry/{{team_id}}/history/

import { z } from "zod";

// Current season GW-by-GW entry
const CurrentGameweekSchema = z.object({
  event: z.number(),
  points: z.number(),
  total_points: z.number(),
  rank: z.number(),
  rank_sort: z.number(),
  overall_rank: z.number(),
  percentile_rank: z.number(),
  bank: z.number(),
  value: z.number(),
  event_transfers: z.number(),
  event_transfers_cost: z.number(),
  points_on_bench: z.number(),
});

// Past season summary
const PastSeasonSchema = z.object({
  season_name: z.string(),
  total_points: z.number(),
  rank: z.number(),
});

// Chip usage
const ChipSchema = z.object({
  name: z.string(), // e.g. "wildcard", "3xc", "bboost", "freehit"
  time: z.string(), // ISO datetime
  event: z.number(),
});

// Main Entry History schema
export const EntryHistorySchema = z.object({
  current: z.array(CurrentGameweekSchema),
  past: z.array(PastSeasonSchema),
  chips: z.array(ChipSchema),
});

// Type exports
export type EntryHistory = z.infer<typeof EntryHistorySchema>;
export type CurrentGameweek = z.infer<typeof CurrentGameweekSchema>;
export type PastSeason = z.infer<typeof PastSeasonSchema>;
export type Chip = z.infer<typeof ChipSchema>;