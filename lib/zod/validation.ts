import { z } from "zod";
import { EntryHistorySchema } from "./schemas/entryHistory";
import { EntrySummarySchema } from "./schemas/entrySummary";
import { LeagueStandingsResponseSchema } from "./schemas/leagueStandings";

const schemas = {
  entryHistory: EntryHistorySchema,
  entrySummary: EntrySummarySchema,
  leagueStandings: LeagueStandingsResponseSchema,
} as const;

export type EndpointName = keyof typeof schemas;

type SchemaOutput<T extends EndpointName> = z.infer<(typeof schemas)[T]>;

export function validate<T extends EndpointName>(
  endpoint: T,
  data: unknown,
): SchemaOutput<T> {
  const result = schemas[endpoint].safeParse(data);

  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Validation failed for "${endpoint}": ${formatted}`);
  }

  return result.data as SchemaOutput<T>;
}
