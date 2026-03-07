// https://fantasy.premierleague.com/api/leagues-classic/{{league_id}}/standings/?page_standings={{page_id}}&phase={{phase}}

import { z } from 'zod';

const NewEntryResultSchema = z.object({
  id: z.number(),
  event_total: z.number(),
  player_name: z.string(),
  rank: z.number(),
  last_rank: z.number(),
  rank_sort: z.number(),
  total: z.number(),
  entry: z.number(),
  entry_name: z.string(),
  has_played: z.boolean(),
  club_badge_src: z.string().nullable()
});

const NewEntriesSchema = z.object({
  has_next: z.boolean(),
  page: z.number(),
  results: z.array(NewEntryResultSchema)
});

const LeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  created: z.string(), // ISO datetime string
  closed: z.boolean(),
  max_entries: z.number().nullable(),
  league_type: z.string(),
  scoring: z.string(),
  admin_entry: z.number(),
  start_event: z.number(),
  code_privacy: z.string(),
  has_cup: z.boolean(),
  cup_league: z.number().nullable(),
  rank: z.number().nullable()
});

const StandingResultSchema = z.object({
  id: z.number(),
  event_total: z.number(),
  player_name: z.string(),
  rank: z.number(),
  last_rank: z.number(),
  rank_sort: z.number(),
  total: z.number(),
  entry: z.number(),
  entry_name: z.string(),
  has_played: z.boolean(),
  club_badge_src: z.string().nullable()
});

const StandingsSchema = z.object({
  has_next: z.boolean(),
  page: z.number(),
  results: z.array(StandingResultSchema)
});

const LeagueStandingsResponseSchema = z.object({
  new_entries: NewEntriesSchema,
  last_updated_data: z.string(), // ISO datetime string
  league: LeagueSchema,
  standings: StandingsSchema
});

export { LeagueStandingsResponseSchema };