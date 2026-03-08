// https://fantasy.premierleague.com/api/bootstrap-static/ 

import { z } from "zod";

// Overrides schema (shared between chips and events)
const OverridesSchema = z.object({
  rules: z.record(z.string(), z.unknown()),
  scoring: z.record(z.string(), z.unknown()),
  element_types: z.array(z.unknown()),
  pick_multiplier: z.number().nullable(),
});

// Chip schema
const ChipSchema = z.object({
  id: z.number(),
  name: z.string(),
  number: z.number(),
  start_event: z.number(),
  stop_event: z.number(),
  chip_type: z.string(),
  overrides: OverridesSchema,
});

// Chip play schema (used in events)
const ChipPlaySchema = z.object({
  chip_name: z.string(),
  num_played: z.number(),
});

// Top element info schema
const TopElementInfoSchema = z.object({
  id: z.number(),
  points: z.number(),
});

// Event (Gameweek) schema
const EventSchema = z.object({
  id: z.number(),
  name: z.string(),
  deadline_time: z.string(),
  release_time: z.string().nullable(),
  average_entry_score: z.number(),
  finished: z.boolean(),
  data_checked: z.boolean(),
  highest_scoring_entry: z.number().nullable(),
  deadline_time_epoch: z.number(),
  deadline_time_game_offset: z.number(),
  highest_score: z.number().nullable(),
  is_previous: z.boolean(),
  is_current: z.boolean(),
  is_next: z.boolean(),
  cup_leagues_created: z.boolean(),
  h2h_ko_matches_created: z.boolean(),
  can_enter: z.boolean(),
  can_manage: z.boolean(),
  released: z.boolean(),
  ranked_count: z.number(),
  overrides: OverridesSchema,
  chip_plays: z.array(ChipPlaySchema),
  most_selected: z.number().nullable(),
  most_transferred_in: z.number().nullable(),
  top_element: z.number().nullable(),
  top_element_info: TopElementInfoSchema.nullable(),
  transfers_made: z.number(),
  most_captained: z.number().nullable(),
  most_vice_captained: z.number().nullable(),
});

// Game settings schema
const GameSettingsSchema = z.object({
  league_join_private_max: z.number(),
  league_join_public_max: z.number(),
  league_max_size_public_classic: z.number(),
  league_max_size_public_h2h: z.number(),
  league_max_size_private_h2h: z.number(),
  league_max_ko_rounds_private_h2h: z.number(),
  league_prefix_public: z.string(),
  league_points_h2h_win: z.number(),
  league_points_h2h_lose: z.number(),
  league_points_h2h_draw: z.number(),
  league_ko_first_instead_of_random: z.boolean(),
  cup_start_event_id: z.number().nullable(),
  cup_stop_event_id: z.number().nullable(),
  cup_qualifying_method: z.string().nullable(),
  cup_type: z.string().nullable(),
  squad_squadplay: z.number(),
  squad_squadsize: z.number(),
  squad_team_limit: z.number(),
  squad_total_spend: z.number(),
  ui_currency_multiplier: z.number(),
  ui_use_special_shirts: z.boolean(),
  ui_special_shirt_exclusions: z.array(z.unknown()),
  stats_form_days: z.number(),
  sys_vice_captain_enabled: z.boolean(),
  transfers_cap: z.number(),
  transfers_sell_on_fee: z.number(),
  max_extra_free_transfers: z.number(),
  league_h2h_tiebreak_stats: z.array(z.string()),
  timezone: z.string(),
});

// Phase schema
const PhaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  start_event: z.number(),
  stop_event: z.number(),
  highest_score: z.number().nullable(),
});

// Team schema
const TeamSchema = z.object({
  code: z.number(),
  draw: z.number(),
  form: z.string().nullable(),
  id: z.number(),
  loss: z.number(),
  name: z.string(),
  played: z.number(),
  points: z.number(),
  position: z.number(),
  short_name: z.string(),
  strength: z.number(),
  team_division: z.number().nullable(),
  unavailable: z.boolean(),
  win: z.number(),
  strength_overall_home: z.number(),
  strength_overall_away: z.number(),
  strength_attack_home: z.number(),
  strength_attack_away: z.number(),
  strength_defence_home: z.number(),
  strength_defence_away: z.number(),
  pulse_id: z.number(),
});

// Element (Player) schema
const ElementSchema = z.object({
  chance_of_playing_next_round: z.number().nullable(),
  chance_of_playing_this_round: z.number().nullable(),
  code: z.number(),
  cost_change_event: z.number(),
  cost_change_event_fall: z.number(),
  cost_change_start: z.number(),
  cost_change_start_fall: z.number(),
  dreamteam_count: z.number(),
  element_type: z.number(),
  ep_next: z.string().nullable(),
  ep_this: z.string().nullable(),
  event_points: z.number(),
  first_name: z.string(),
  form: z.string(),
  id: z.number(),
  in_dreamteam: z.boolean(),
  news: z.string(),
  news_added: z.string().nullable(),
  now_cost: z.number(),
  photo: z.string(),
  points_per_game: z.string(),
  second_name: z.string(),
  selected_by_percent: z.string(),
  special: z.boolean(),
  squad_number: z.number().nullable(),
  status: z.string(),
  team: z.number(),
  team_code: z.number(),
  total_points: z.number(),
  transfers_in: z.number(),
  transfers_in_event: z.number(),
  transfers_out: z.number(),
  transfers_out_event: z.number(),
  value_form: z.string(),
  value_season: z.string(),
  web_name: z.string(),
  minutes: z.number(),
  goals_scored: z.number(),
  assists: z.number(),
  clean_sheets: z.number(),
  goals_conceded: z.number(),
  own_goals: z.number(),
  penalties_saved: z.number(),
  penalties_missed: z.number(),
  yellow_cards: z.number(),
  red_cards: z.number(),
  saves: z.number(),
  bonus: z.number(),
  bps: z.number(),
  influence: z.string(),
  creativity: z.string(),
  threat: z.string(),
  ict_index: z.string(),
  starts: z.number(),
  expected_goals: z.string(),
  expected_assists: z.string(),
  expected_goal_involvements: z.string(),
  expected_goals_conceded: z.string(),
  influence_rank: z.number(),
  influence_rank_type: z.number(),
  creativity_rank: z.number(),
  creativity_rank_type: z.number(),
  threat_rank: z.number(),
  threat_rank_type: z.number(),
  ict_index_rank: z.number(),
  ict_index_rank_type: z.number(),
  corners_and_indirect_freekicks_order: z.number().nullable(),
  corners_and_indirect_freekicks_text: z.string(),
  direct_freekicks_order: z.number().nullable(),
  direct_freekicks_text: z.string(),
  penalties_order: z.number().nullable(),
  penalties_text: z.string(),
  expected_goals_per_90: z.number(),
  saves_per_90: z.number(),
  expected_assists_per_90: z.number(),
  expected_goal_involvements_per_90: z.number(),
  expected_goals_conceded_per_90: z.number(),
  goals_conceded_per_90: z.number(),
  now_cost_rank: z.number(),
  now_cost_rank_type: z.number(),
  form_rank: z.number(),
  form_rank_type: z.number(),
  points_per_game_rank: z.number(),
  points_per_game_rank_type: z.number(),
  selected_rank: z.number(),
  selected_rank_type: z.number(),
  starts_per_90: z.number(),
  clean_sheets_per_90: z.number(),
});

// Element stats schema
const ElementStatSchema = z.object({
  label: z.string(),
  name: z.string(),
});

// Element type (position) schema
const ElementTypeSchema = z.object({
  id: z.number(),
  plural_name: z.string(),
  plural_name_short: z.string(),
  singular_name: z.string(),
  singular_name_short: z.string(),
  squad_select: z.number(),
  squad_min_select: z.number().nullable(),
  squad_max_select: z.number().nullable(),
  squad_min_play: z.number(),
  squad_max_play: z.number(),
  ui_shirt_specific: z.boolean(),
  sub_positions_locked: z.array(z.number()),
  element_count: z.number(),
});

// Main Bootstrap Static Response schema
export const BootstrapStaticSchema = z.object({
  chips: z.array(ChipSchema),
  events: z.array(EventSchema),
  game_settings: GameSettingsSchema,
  phases: z.array(PhaseSchema),
  teams: z.array(TeamSchema),
  total_players: z.number(),
  elements: z.array(ElementSchema),
  element_stats: z.array(ElementStatSchema),
  element_types: z.array(ElementTypeSchema),
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