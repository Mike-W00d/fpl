// https://fantasy.premierleague.com/api/entry/{{team_id}}/event/{{gw_id}}/picks/

import { z } from "zod";

export const PickSchema = z.object({
  element: z.number(),
  position: z.number(),
  multiplier: z.number(),
  is_captain: z.boolean(),
  is_vice_captain: z.boolean(),
  element_type: z.number(),
});

const AutomaticSubSchema = z.object({
  entry: z.number().nullable().optional(),
  element_in: z.number().nullable().optional(),
  element_out: z.number().nullable().optional(),
  event: z.number().nullable().optional(),
});

const EntryHistorySchema = z.object({
  event: z.number().nullable().optional(),
  points: z.number().nullable().optional(),
  total_points: z.number().nullable().optional(),
  rank: z.number().nullable().optional(),
  rank_sort: z.number().nullable().optional(),
  overall_rank: z.number().nullable().optional(),
  percentile_rank: z.number().nullable().optional(),
  bank: z.number().nullable().optional(),
  value: z.number().nullable().optional(),
  event_transfers: z.number().nullable().optional(),
  event_transfers_cost: z.number().nullable().optional(),
  points_on_bench: z.number().nullable().optional(),
});

export const GameweekPicksSchema = z.object({
  active_chip: z.string().nullable(),
  automatic_subs: z.array(AutomaticSubSchema).optional(),
  entry_history: EntryHistorySchema.optional(),
  picks: z.array(PickSchema),
});

export type GameweekPicks = z.infer<typeof GameweekPicksSchema>;
export type Pick = z.infer<typeof PickSchema>;
