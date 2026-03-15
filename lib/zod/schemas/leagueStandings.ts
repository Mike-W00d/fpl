// https://fantasy.premierleague.com/api/leagues-classic/{{league_id}}/standings/?page_standings={{page_id}}&phase={{phase}}

import { z } from 'zod';

const NewEntryResultSchema = z.object({
  id: z.number().nullable().optional(),
  event_total: z.number().nullable().optional(),
  player_name: z.string().nullable().optional(),
  rank: z.number().nullable().optional(),
  last_rank: z.number().nullable().optional(),
  rank_sort: z.number().nullable().optional(),
  total: z.number().nullable().optional(),
  entry: z.number().nullable().optional(),
  entry_name: z.string().nullable().optional(),
  has_played: z.boolean().nullable().optional(),
  club_badge_src: z.string().nullable().optional()
});

const NewEntriesSchema = z.object({
  has_next: z.boolean().nullable().optional(),
  page: z.number().nullable().optional(),
  results: z.array(NewEntryResultSchema).nullable().optional()
});

const LeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  created: z.string().nullable().optional(),
  closed: z.boolean().nullable().optional(),
  max_entries: z.number().nullable().optional(),
  league_type: z.string().nullable().optional(),
  scoring: z.string().nullable().optional(),
  admin_entry: z.number().nullable().optional(),
  start_event: z.number().nullable().optional(),
  code_privacy: z.string().nullable().optional(),
  has_cup: z.boolean().nullable().optional(),
  cup_league: z.number().nullable().optional(),
  rank: z.number().nullable().optional()
});

const StandingResultSchema = z.object({
  id: z.number().nullable().optional(),
  event_total: z.number().nullable().optional(),
  player_name: z.string(),
  rank: z.number(),
  last_rank: z.number().nullable().optional(),
  rank_sort: z.number().nullable().optional(),
  total: z.number(),
  entry: z.number(),
  entry_name: z.string(),
  has_played: z.boolean().nullable().optional(),
  club_badge_src: z.string().nullable().optional()
});

const StandingsSchema = z.object({
  has_next: z.boolean(),
  page: z.number(),
  results: z.array(StandingResultSchema)
});

const LeagueStandingsResponseSchema = z.object({
  new_entries: NewEntriesSchema.optional(),
  last_updated_data: z.string().nullable().optional(),
  league: LeagueSchema,
  standings: StandingsSchema
});

export { LeagueStandingsResponseSchema };

export type StandingResult = z.infer<typeof StandingResultSchema>;
