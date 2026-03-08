import type { EntryHistory } from "@/lib/zod/schemas/entryHistory";

export type AwardEntry = {
  entry: number;
  entry_name: string;
  player_name: string;
  history: EntryHistory;
};

export type AwardInput = {
  entries: AwardEntry[];
};

export type AwardResult = {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  gradient: string;
  winner: {
    entry_name: string;
    player_name: string;
  };
  heroStat: string;
  statLabel: string;
  description: string;
  runnerUp?: {
    entry_name: string;
    player_name: string;
    stat: string;
  };
};

export type AwardDefinition = {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  gradient: string;
  compute: (input: AwardInput) => AwardResult | null;
};
