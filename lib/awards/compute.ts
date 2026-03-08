import type { AwardInput, AwardResult } from "./types";
import { awardDefinitions } from "./definitions";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function computeAwards(input: AwardInput): AwardResult[] {
  const results = awardDefinitions
    .map((def) => def.compute(input))
    .filter((result): result is AwardResult => result !== null);
  return shuffle(results);
}
