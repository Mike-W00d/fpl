// https://fantasy.premierleague.com/api/entry/{{team_id}}/

import { z } from "zod";

// Active phase within a league
const ActivePhaseSchema = z.object({
  phase: z.number(),
  rank: z.number(),
  last_rank: z.number().nullable().optional(),
  rank_sort: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
  league_id: z.number().nullable().optional(),
  rank_count: z.number(),
  entry_percentile_rank: z.number().nullable().optional(),
});

// Classic league entry
const ClassicLeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  short_name: z.string().nullable().optional(),
  created: z.string().nullable().optional(),
  closed: z.boolean().nullable().optional(),
  rank: z.number().nullable(),
  max_entries: z.number().nullable().optional(),
  league_type: z.string().nullable().optional(),
  scoring: z.string().nullable().optional(),
  admin_entry: z.number().nullable().optional(),
  start_event: z.number().nullable().optional(),
  entry_can_leave: z.boolean().nullable().optional(),
  entry_can_admin: z.boolean().nullable().optional(),
  entry_can_invite: z.boolean().nullable().optional(),
  has_cup: z.boolean().nullable().optional(),
  cup_league: z.number().nullable().optional(),
  cup_qualified: z.boolean().nullable().optional(),
  rank_count: z.number(),
  entry_percentile_rank: z.number(),
  active_phases: z.array(ActivePhaseSchema),
  featured_entry_ids: z.array(z.number()).nullable().optional(),
  entry_rank: z.number().nullable().optional(),
  entry_last_rank: z.number().nullable().optional(),
});

// Cup match
const CupMatchSchema = z.object({
  id: z.number().nullable().optional(),
  entry_1_entry: z.number().nullable().optional(),
  entry_1_name: z.string().nullable().optional(),
  entry_1_player_name: z.string().nullable().optional(),
  entry_1_points: z.number().nullable().optional(),
  entry_1_win: z.number().nullable().optional(),
  entry_1_draw: z.number().nullable().optional(),
  entry_1_loss: z.number().nullable().optional(),
  entry_1_total: z.number().nullable().optional(),
  entry_2_entry: z.number().nullable().optional(),
  entry_2_name: z.string().nullable().optional(),
  entry_2_player_name: z.string().nullable().optional(),
  entry_2_points: z.number().nullable().optional(),
  entry_2_win: z.number().nullable().optional(),
  entry_2_draw: z.number().nullable().optional(),
  entry_2_loss: z.number().nullable().optional(),
  entry_2_total: z.number().nullable().optional(),
  is_knockout: z.boolean().nullable().optional(),
  league: z.number().nullable().optional(),
  winner: z.number().nullable().optional(),
  seed_value: z.number().nullable().optional(),
  event: z.number().nullable().optional(),
  tiebreak: z.string().nullable().optional(),
  is_bye: z.boolean().nullable().optional(),
  knockout_name: z.string().nullable().optional(),
});

// Cup status
const CupStatusSchema = z.object({
  qualification_event: z.number().nullable().optional(),
  qualification_numbers: z.number().nullable().optional(),
  qualification_rank: z.number().nullable().optional(),
  qualification_state: z.string().nullable().optional(),
});

// Cup object
const CupSchema = z.object({
  matches: z.array(CupMatchSchema).nullable().optional(),
  status: CupStatusSchema.nullable().optional(),
  cup_league: z.number().nullable().optional(),
});

// Leagues object
const LeaguesSchema = z.object({
  classic: z.array(ClassicLeagueSchema),
  h2h: z.array(z.unknown()).optional(),
  cup: CupSchema.optional(),
  cup_matches: z.array(CupMatchSchema).optional(),
});

// Main Entry Summary schema
export const EntrySummarySchema = z.object({
  id: z.number(),
  joined_time: z.string().nullable().optional(),
  started_event: z.number().nullable().optional(),
  favourite_team: z.number().nullable().optional(),
  player_first_name: z.string(),
  player_last_name: z.string(),
  player_region_id: z.number().nullable().optional(),
  player_region_name: z.string().nullable().optional(),
  player_region_iso_code_short: z.string().nullable().optional(),
  player_region_iso_code_long: z.string().nullable().optional(),
  years_active: z.number().nullable().optional(),
  summary_overall_points: z.number(),
  summary_overall_rank: z.number(),
  summary_event_points: z.number().nullable().optional(),
  summary_event_rank: z.number().nullable().optional(),
  current_event: z.number().nullable().optional(),
  leagues: LeaguesSchema,
});

// Type exports
export type EntrySummary = z.infer<typeof EntrySummarySchema>;
export type ClassicLeague = z.infer<typeof ClassicLeagueSchema>;
export type CupMatch = z.infer<typeof CupMatchSchema>;
export type ActivePhase = z.infer<typeof ActivePhaseSchema>;
