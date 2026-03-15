// https://fantasy.premierleague.com/api/entry/{{team_id}}/history/

import { z } from "zod";

// Current season GW-by-GW entry
const CurrentGameweekSchema = z.object({
  event: z.number(),
  points: z.number(),
  total_points: z.number(),
  rank: z.number().nullable(),
  rank_sort: z.number().nullable().optional(),
  overall_rank: z.number(),
  percentile_rank: z.number().nullable().optional(),
  bank: z.number(),
  value: z.number(),
  event_transfers: z.number(),
  event_transfers_cost: z.number(),
  points_on_bench: z.number(),
});

// Past season summary
const PastSeasonSchema = z.object({
  season_name: z.string().nullable().optional(),
  total_points: z.number().nullable().optional(),
  rank: z.number().nullable().optional(),
});

// Chip usage
const ChipSchema = z.object({
  name: z.string(),
  time: z.string().nullable().optional(),
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
