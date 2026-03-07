// https://fantasy.premierleague.com/api/entry/{{team_id}}/

import { z } from "zod";

// Active phase within a league
const ActivePhaseSchema = z.object({
  phase: z.number(),
  rank: z.number(),
  last_rank: z.number(),
  rank_sort: z.number(),
  total: z.number(),
  league_id: z.number(),
  rank_count: z.number(),
  entry_percentile_rank: z.number(),
});

// Classic league entry
const ClassicLeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  short_name: z.string().nullable(),
  created: z.string(), // ISO datetime
  closed: z.boolean(),
  rank: z.number().nullable(),
  max_entries: z.number().nullable(),
  league_type: z.string(), // 's' = system, 'x' = private
  scoring: z.string(),
  admin_entry: z.number().nullable(),
  start_event: z.number(),
  entry_can_leave: z.boolean(),
  entry_can_admin: z.boolean(),
  entry_can_invite: z.boolean(),
  has_cup: z.boolean(),
  cup_league: z.number().nullable(),
  cup_qualified: z.boolean().nullable(),
  rank_count: z.number(),
  entry_percentile_rank: z.number(),
  active_phases: z.array(ActivePhaseSchema),
  featured_entry_ids: z.array(z.number()),
  entry_rank: z.number(),
  entry_last_rank: z.number(),
});

// Cup match
const CupMatchSchema = z.object({
  id: z.number(),
  entry_1_entry: z.number(),
  entry_1_name: z.string(),
  entry_1_player_name: z.string(),
  entry_1_points: z.number(),
  entry_1_win: z.number(),
  entry_1_draw: z.number(),
  entry_1_loss: z.number(),
  entry_1_total: z.number(),
  entry_2_entry: z.number(),
  entry_2_name: z.string(),
  entry_2_player_name: z.string(),
  entry_2_points: z.number(),
  entry_2_win: z.number(),
  entry_2_draw: z.number(),
  entry_2_loss: z.number(),
  entry_2_total: z.number(),
  is_knockout: z.boolean(),
  league: z.number(),
  winner: z.number(),
  seed_value: z.number().nullable(),
  event: z.number(),
  tiebreak: z.string().nullable(),
  is_bye: z.boolean(),
  knockout_name: z.string(),
});

// Cup status
const CupStatusSchema = z.object({
  qualification_event: z.number().nullable(),
  qualification_numbers: z.number().nullable(),
  qualification_rank: z.number().nullable(),
  qualification_state: z.string().nullable(),
});

// Cup object
const CupSchema = z.object({
  matches: z.array(CupMatchSchema),
  status: CupStatusSchema,
  cup_league: z.number().nullable(),
});

// Leagues object
const LeaguesSchema = z.object({
  classic: z.array(ClassicLeagueSchema),
  h2h: z.array(z.unknown()), // Empty in response, structure unknown
  cup: CupSchema,
  cup_matches: z.array(CupMatchSchema),
});

// Main Entry Summary schema
export const EntrySummarySchema = z.object({
  id: z.number(),
  joined_time: z.string(),
  started_event: z.number(),
  favourite_team: z.number(),
  player_first_name: z.string(),
  player_last_name: z.string(),
  player_region_id: z.number(),
  player_region_name: z.string(),
  player_region_iso_code_short: z.string(),
  player_region_iso_code_long: z.string(),
  years_active: z.number(),
  summary_overall_points: z.number(),
  summary_overall_rank: z.number(),
  summary_event_points: z.number(),
  summary_event_rank: z.number(),
  current_event: z.number(),
  leagues: LeaguesSchema,
});

// Type exports
export type EntrySummary = z.infer<typeof EntrySummarySchema>;
export type ClassicLeague = z.infer<typeof ClassicLeagueSchema>;
export type CupMatch = z.infer<typeof CupMatchSchema>;
export type ActivePhase = z.infer<typeof ActivePhaseSchema>;