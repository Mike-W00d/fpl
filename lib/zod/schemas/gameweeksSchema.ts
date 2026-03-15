// https://fantasy.premierleague.com/api/bootstrap-static/

import { z } from "zod";

// Helper for lenient fields
const l = {
  num: z.number().nullable().optional(),
  str: z.string().nullable().optional(),
  bool: z.boolean().nullable().optional(),
};

// Overrides schema (shared between chips and events)
const OverridesSchema = z.object({
  rules: z.record(z.string(), z.unknown()).nullable().optional(),
  scoring: z.record(z.string(), z.unknown()).nullable().optional(),
  element_types: z.array(z.unknown()).nullable().optional(),
  pick_multiplier: z.number().nullable().optional(),
});

// Chip schema
const ChipSchema = z.object({
  id: l.num,
  name: l.str,
  number: l.num,
  start_event: l.num,
  stop_event: l.num,
  chip_type: l.str,
  overrides: OverridesSchema.nullable().optional(),
});

// Chip play schema (used in events)
const ChipPlaySchema = z.object({
  chip_name: z.string(),
  num_played: z.number(),
});

// Top element info schema
const TopElementInfoSchema = z.object({
  id: l.num,
  points: l.num,
});

// Event (Gameweek) schema
const EventSchema = z.object({
  id: z.number(),
  name: l.str,
  deadline_time: l.str,
  release_time: l.str,
  average_entry_score: z.number(),
  finished: z.boolean(),
  data_checked: z.boolean(),
  highest_scoring_entry: l.num,
  deadline_time_epoch: l.num,
  deadline_time_game_offset: l.num,
  highest_score: z.number().nullable(),
  is_previous: l.bool,
  is_current: l.bool,
  is_next: l.bool,
  cup_leagues_created: l.bool,
  h2h_ko_matches_created: l.bool,
  can_enter: l.bool,
  can_manage: l.bool,
  released: l.bool,
  ranked_count: l.num,
  overrides: OverridesSchema.nullable().optional(),
  chip_plays: z.array(ChipPlaySchema),
  most_selected: l.num,
  most_transferred_in: l.num,
  top_element: l.num,
  top_element_info: TopElementInfoSchema.nullable().optional(),
  transfers_made: l.num,
  most_captained: l.num,
  most_vice_captained: l.num,
});

// Game settings schema
const GameSettingsSchema = z.object({
  league_join_private_max: l.num,
  league_join_public_max: l.num,
  league_max_size_public_classic: l.num,
  league_max_size_public_h2h: l.num,
  league_max_size_private_h2h: l.num,
  league_max_ko_rounds_private_h2h: l.num,
  league_prefix_public: l.str,
  league_points_h2h_win: l.num,
  league_points_h2h_lose: l.num,
  league_points_h2h_draw: l.num,
  league_ko_first_instead_of_random: l.bool,
  cup_start_event_id: l.num,
  cup_stop_event_id: l.num,
  cup_qualifying_method: l.str,
  cup_type: l.str,
  squad_squadplay: l.num,
  squad_squadsize: l.num,
  squad_team_limit: l.num,
  squad_total_spend: l.num,
  ui_currency_multiplier: l.num,
  ui_use_special_shirts: l.bool,
  ui_special_shirt_exclusions: z.array(z.unknown()).nullable().optional(),
  stats_form_days: l.num,
  sys_vice_captain_enabled: l.bool,
  transfers_cap: l.num,
  transfers_sell_on_fee: l.num,
  max_extra_free_transfers: l.num,
  league_h2h_tiebreak_stats: z.array(z.string()).nullable().optional(),
  timezone: l.str,
});

// Phase schema
const PhaseSchema = z.object({
  id: l.num,
  name: l.str,
  start_event: l.num,
  stop_event: l.num,
  highest_score: l.num,
});

// Team schema
const TeamSchema = z.object({
  code: l.num,
  draw: l.num,
  form: l.str,
  id: l.num,
  loss: l.num,
  name: l.str,
  played: l.num,
  points: l.num,
  position: l.num,
  short_name: l.str,
  strength: l.num,
  team_division: l.num,
  unavailable: l.bool,
  win: l.num,
  strength_overall_home: l.num,
  strength_overall_away: l.num,
  strength_attack_home: l.num,
  strength_attack_away: l.num,
  strength_defence_home: l.num,
  strength_defence_away: l.num,
  pulse_id: l.num,
});

// Element (Player) schema
const ElementSchema = z.object({
  chance_of_playing_next_round: l.num,
  chance_of_playing_this_round: l.num,
  code: l.num,
  cost_change_event: l.num,
  cost_change_event_fall: l.num,
  cost_change_start: l.num,
  cost_change_start_fall: l.num,
  dreamteam_count: l.num,
  element_type: z.number(),
  ep_next: l.str,
  ep_this: l.str,
  event_points: l.num,
  first_name: l.str,
  form: l.str,
  id: z.number(),
  in_dreamteam: l.bool,
  news: l.str,
  news_added: l.str,
  now_cost: l.num,
  photo: l.str,
  points_per_game: l.str,
  second_name: l.str,
  selected_by_percent: l.str,
  special: l.bool,
  squad_number: l.num,
  status: l.str,
  team: l.num,
  team_code: l.num,
  total_points: l.num,
  transfers_in: l.num,
  transfers_in_event: l.num,
  transfers_out: l.num,
  transfers_out_event: l.num,
  value_form: l.str,
  value_season: l.str,
  web_name: z.string(),
  minutes: l.num,
  goals_scored: l.num,
  assists: l.num,
  clean_sheets: l.num,
  goals_conceded: l.num,
  own_goals: l.num,
  penalties_saved: l.num,
  penalties_missed: l.num,
  yellow_cards: l.num,
  red_cards: l.num,
  saves: l.num,
  bonus: l.num,
  bps: l.num,
  influence: l.str,
  creativity: l.str,
  threat: l.str,
  ict_index: l.str,
  starts: l.num,
  expected_goals: l.str,
  expected_assists: l.str,
  expected_goal_involvements: l.str,
  expected_goals_conceded: l.str,
  influence_rank: l.num,
  influence_rank_type: l.num,
  creativity_rank: l.num,
  creativity_rank_type: l.num,
  threat_rank: l.num,
  threat_rank_type: l.num,
  ict_index_rank: l.num,
  ict_index_rank_type: l.num,
  corners_and_indirect_freekicks_order: l.num,
  corners_and_indirect_freekicks_text: l.str,
  direct_freekicks_order: l.num,
  direct_freekicks_text: l.str,
  penalties_order: l.num,
  penalties_text: l.str,
  expected_goals_per_90: l.num,
  saves_per_90: l.num,
  expected_assists_per_90: l.num,
  expected_goal_involvements_per_90: l.num,
  expected_goals_conceded_per_90: l.num,
  goals_conceded_per_90: l.num,
  now_cost_rank: l.num,
  now_cost_rank_type: l.num,
  form_rank: l.num,
  form_rank_type: l.num,
  points_per_game_rank: l.num,
  points_per_game_rank_type: l.num,
  selected_rank: l.num,
  selected_rank_type: l.num,
  starts_per_90: l.num,
  clean_sheets_per_90: l.num,
});

// Element stats schema
const ElementStatSchema = z.object({
  label: l.str,
  name: l.str,
});

// Element type (position) schema
const ElementTypeSchema = z.object({
  id: l.num,
  plural_name: l.str,
  plural_name_short: l.str,
  singular_name: l.str,
  singular_name_short: l.str,
  squad_select: l.num,
  squad_min_select: l.num,
  squad_max_select: l.num,
  squad_min_play: l.num,
  squad_max_play: l.num,
  ui_shirt_specific: l.bool,
  sub_positions_locked: z.array(z.number()).nullable().optional(),
  element_count: l.num,
});

// Main Bootstrap Static Response schema
export const BootstrapStaticSchema = z.object({
  chips: z.array(ChipSchema).optional(),
  events: z.array(EventSchema),
  game_settings: GameSettingsSchema.optional(),
  phases: z.array(PhaseSchema).optional(),
  teams: z.array(TeamSchema).optional(),
  total_players: z.number().nullable().optional(),
  elements: z.array(ElementSchema),
  element_stats: z.array(ElementStatSchema).optional(),
  element_types: z.array(ElementTypeSchema).optional(),
});

// Export individual schemas for reuse
export {
  ChipSchema,
  EventSchema,
  GameSettingsSchema,
  PhaseSchema,
  TeamSchema,
  ElementSchema,
  ElementStatSchema,
  ElementTypeSchema,
  OverridesSchema,
  ChipPlaySchema,
  TopElementInfoSchema,
};

// Inferred TypeScript types
export type BootstrapStatic = z.infer<typeof BootstrapStaticSchema>;
export type Chip = z.infer<typeof ChipSchema>;
export type Event = z.infer<typeof EventSchema>;
export type GameSettings = z.infer<typeof GameSettingsSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Element = z.infer<typeof ElementSchema>;
export type ElementStat = z.infer<typeof ElementStatSchema>;
export type ElementType = z.infer<typeof ElementTypeSchema>;
