import type { AwardDefinition, AwardInput, AwardEntry } from "./types";

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
}

export const awardDefinitions: AwardDefinition[] = [
  {
    id: "the-chef",
    name: "The Chef",
    emoji: "💥",
    image: "chef.jpg",
    gradient: "from-emerald-500 to-green-700",
    compute: (input: AwardInput) => {
      let best: { entry: AwardEntry; gw: number; points: number } | null =
        null;
      let second: { entry: AwardEntry; gw: number; points: number } | null =
        null;

      for (const entry of input.entries) {
        for (const gw of entry.history.current) {
          if (!best || gw.points > best.points) {
            second = best;
            best = { entry, gw: gw.event, points: gw.points };
          } else if (!second || gw.points > second.points) {
            second = { entry, gw: gw.event, points: gw.points };
          }
        }
      }

      if (!best) return null;

      return {
        id: "the-chef",
        name: "The Chef",
        emoji: "💥",
        image: "chef.jpg",
        gradient: "from-emerald-500 to-green-700",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `${best.points}`,
        statLabel: `points in GW${best.gw}`,
        description: "Cooked up something special — highest single gameweek score in the league",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `${second.points} pts (GW${second.gw})`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-liz-truss",
    name: "The Liz Truss",
    emoji: "🥬",
    image: "the-lizz-truss.webp",
    gradient: "from-slate-500 to-slate-700",
    compute: (input: AwardInput) => {
      let worst: { entry: AwardEntry; gw: number; points: number } | null =
        null;
      let second: { entry: AwardEntry; gw: number; points: number } | null =
        null;

      for (const entry of input.entries) {
        for (const gw of entry.history.current) {
          if (!worst || gw.points < worst.points) {
            second = worst;
            worst = { entry, gw: gw.event, points: gw.points };
          } else if (!second || gw.points < second.points) {
            second = { entry, gw: gw.event, points: gw.points };
          }
        }
      }

      if (!worst) return null;

      return {
        id: "the-liz-truss",
        name: "The Liz Truss",
        emoji: "🥬",
        image: "the-lizz-truss.webp",
        gradient: "from-slate-500 to-slate-700",
        winner: {
          entry_name: worst.entry.entry_name,
          player_name: worst.entry.player_name,
        },
        heroStat: `${worst.points}`,
        statLabel: `points in GW${worst.gw}`,
        description: "An awful week in charge — lowest single gameweek score in the league",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `${second.points} pts (GW${second.gw})`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-burnley-at-home",
    name: "The Burnley At Home",
    emoji: "🪑",
    image: "the-burnley.jpg",
    gradient: "from-amber-500 to-orange-600",
    compute: (input: AwardInput) => {
      const totals = input.entries.map((entry) => ({
        entry,
        total: entry.history.current.reduce(
          (sum, gw) => sum + gw.points_on_bench,
          0,
        ),
      }));

      totals.sort((a, b) => b.total - a.total);
      const best = totals[0];
      const second = totals[1];

      if (!best || best.total === 0) return null;

      return {
        id: "the-burnley-at-home",
        name: "The Burnley At Home",
        emoji: "🪑",
        image: "the-burnley.jpg",
        gradient: "from-amber-500 to-orange-600",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `${best.total}`,
        statLabel: "points left on the bench",
        description: "Always leaving all your best players on the bench — it's only Burnley at home",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `${second.total} pts`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-tinder-swindler",
    name: "The Tinder Swindler",
    emoji: "🔄",
    image: "the-tinder-swindler.webp",
    gradient: "from-violet-500 to-purple-700",
    compute: (input: AwardInput) => {
      const totals = input.entries.map((entry) => ({
        entry,
        total: entry.history.current.reduce(
          (sum, gw) => sum + gw.event_transfers,
          0,
        ),
      }));

      totals.sort((a, b) => b.total - a.total);
      const best = totals[0];
      const second = totals[1];

      if (!best || best.total === 0) return null;

      return {
        id: "the-tinder-swindler",
        name: "The Tinder Swindler",
        emoji: "🔄",
        image: "the-tinder-swindler.webp",
        gradient: "from-violet-500 to-purple-700",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `${best.total}`,
        statLabel: "transfers made",
        description: "Lover of the game constantly swiping — most transfers made across the season",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `${second.total} transfers`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-jake-paul",
    name: "The Jake Paul",
    emoji: "🎯",
    image: "jake-paul.webp",
    gradient: "from-red-500 to-rose-700",
    compute: (input: AwardInput) => {
      const totals = input.entries.map((entry) => ({
        entry,
        total: entry.history.current.reduce(
          (sum, gw) => sum + gw.event_transfers_cost,
          0,
        ),
      }));

      totals.sort((a, b) => b.total - a.total);
      const best = totals[0];
      const second = totals[1];

      if (!best || best.total === 0) return null;

      return {
        id: "the-jake-paul",
        name: "The Jake Paul",
        emoji: "🎯",
        image: "jake-paul.webp",
        gradient: "from-red-500 to-rose-700",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `-${best.total}`,
        statLabel: "points in transfer penalties",
        description: "Most hits taken on transfers this season",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `-${second.total} pts`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-arsenal-corner",
    name: "The Arsenal Corner",
    emoji: "📏",
    image: "arsenal-corner.jpg",
    gradient: "from-sky-500 to-blue-700",
    compute: (input: AwardInput) => {
      const entries = input.entries
        .filter((e) => e.history.current.length >= 3)
        .map((entry) => {
          const points = entry.history.current.map((gw) => gw.points);
          return { entry, sd: stdDev(points) };
        });

      if (entries.length === 0) return null;

      entries.sort((a, b) => a.sd - b.sd);
      const best = entries[0];
      const second = entries[1];

      return {
        id: "the-arsenal-corner",
        name: "The Arsenal Corner",
        emoji: "📏",
        image: "arsenal-corner.jpg",
        gradient: "from-sky-500 to-blue-700",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `σ ${best.sd.toFixed(1)}`,
        statLabel: "std deviation in weekly points",
        description: "Same boring routine, every time — most consistent performer",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `σ ${second.sd.toFixed(1)}`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-jordan-belfort",
    name: "The Jordan Belfort",
    emoji: "📈",
    image: "the-jordan-belfort.jpg",
    gradient: "from-teal-500 to-cyan-700",
    compute: (input: AwardInput) => {
      const entries = input.entries
        .filter((e) => e.history.current.length >= 2)
        .map((entry) => {
          const first = entry.history.current[0];
          const last = entry.history.current[entry.history.current.length - 1];
          return {
            entry,
            increase: (last.value + last.bank) - (first.value + first.bank),
            startValue: first.value + first.bank,
            endValue: last.value + last.bank,
          };
        });

      if (entries.length === 0) return null;

      entries.sort((a, b) => b.increase - a.increase);
      const best = entries[0];
      const second = entries[1];

      if (best.increase <= 0) return null;

      return {
        id: "the-jordan-belfort",
        name: "The Jordan Belfort",
        emoji: "📈",
        image: "the-jordan-belfort.jpg",
        gradient: "from-teal-500 to-cyan-700",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `£${(best.increase / 10).toFixed(1)}m`,
        statLabel: "total value increase",
        description: "Unsure where the all money is coming from — biggest squad value increase from GW1",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `£${(second.increase / 10).toFixed(1)}m`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-george-osborne",
    name: "The George Osborne",
    emoji: "💰",
    image: "the-george-osborne.jpg",
    gradient: "from-yellow-500 to-amber-700",
    compute: (input: AwardInput) => {
      const entries = input.entries
        .filter((e) => e.history.current.length >= 1)
        .map((entry) => {
          const banks = entry.history.current.map((gw) => gw.bank);
          const avg = banks.reduce((a, b) => a + b, 0) / banks.length;
          return { entry, avg };
        });

      if (entries.length === 0) return null;

      entries.sort((a, b) => b.avg - a.avg);
      const best = entries[0];
      const second = entries[1];

      return {
        id: "the-george-osborne",
        name: "The George Osborne",
        emoji: "💰",
        image: "the-george-osborne.jpg",
        gradient: "from-yellow-500 to-amber-700",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `£${(best.avg / 10).toFixed(1)}m`,
        statLabel: "avg in the bank",
        description:
          "Austerity manager — highest average money left unspent in the bank",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `£${(second.avg / 10).toFixed(1)}m`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-gary-neville",
    name: "The Gary Neville",
    emoji: "💀",

    gradient: "from-zinc-600 to-neutral-800",
    compute: (input: AwardInput) => {
      let worst: {
        entry: AwardEntry;
        chipName: string;
        gw: number;
        points: number;
      } | null = null;
      let second: {
        entry: AwardEntry;
        chipName: string;
        gw: number;
        points: number;
      } | null = null;

      const chipLabels: Record<string, string> = {
        wildcard: "Wildcard",
        "3xc": "Triple Captain",
        bboost: "Bench Boost",
        freehit: "Free Hit",
      };

      for (const entry of input.entries) {
        for (const chip of entry.history.chips) {
          // Skip wildcard — it doesn't directly boost a single GW score
          if (chip.name === "wildcard") continue;

          const gw = entry.history.current.find(
            (g) => g.event === chip.event,
          );
          if (!gw) continue;

          if (!worst || gw.points < worst.points) {
            second = worst;
            worst = {
              entry,
              chipName: chipLabels[chip.name] || chip.name,
              gw: chip.event,
              points: gw.points,
            };
          } else if (!second || gw.points < second.points) {
            second = {
              entry,
              chipName: chipLabels[chip.name] || chip.name,
              gw: chip.event,
              points: gw.points,
            };
          }
        }
      }

      if (!worst) return null;

      return {
        id: "the-gary-neville",
        name: "The Gary Neville",
        emoji: "💀",
        image: "the-gary-neville.jpg",
        gradient: "from-zinc-600 to-neutral-800",
        winner: {
          entry_name: worst.entry.entry_name,
          player_name: worst.entry.player_name,
        },
        heroStat: `${worst.points}`,
        statLabel: `pts with ${worst.chipName} (GW${worst.gw})`,
        description: "Lowest score in a gameweek where a chip was played",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `${second.points} pts (${second.chipName}, GW${second.gw})`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-jose-mourinho",
    name: "The Jose Mourinho",
    emoji: "🏆",
    image: "the-jose.webp",
    gradient: "from-indigo-500 to-blue-800",
    compute: (input: AwardInput) => {
      let best: {
        entry: AwardEntry;
        chipName: string;
        gw: number;
        points: number;
      } | null = null;
      let second: {
        entry: AwardEntry;
        chipName: string;
        gw: number;
        points: number;
      } | null = null;

      const chipLabels: Record<string, string> = {
        wildcard: "Wildcard",
        "3xc": "Triple Captain",
        bboost: "Bench Boost",
        freehit: "Free Hit",
      };

      for (const entry of input.entries) {
        for (const chip of entry.history.chips) {
          if (chip.name === "wildcard") continue;

          const gw = entry.history.current.find(
            (g) => g.event === chip.event,
          );
          if (!gw) continue;

          if (!best || gw.points > best.points) {
            second = best;
            best = {
              entry,
              chipName: chipLabels[chip.name] || chip.name,
              gw: chip.event,
              points: gw.points,
            };
          } else if (!second || gw.points > second.points) {
            second = {
              entry,
              chipName: chipLabels[chip.name] || chip.name,
              gw: chip.event,
              points: gw.points,
            };
          }
        }
      }

      if (!best) return null;

      return {
        id: "the-jose-mourinho",
        name: "The Jose Mourinho",
        emoji: "🏆",
        image: "the-jose.webp",
        gradient: "from-indigo-500 to-blue-800",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `${best.points}`,
        statLabel: `pts with ${best.chipName} (GW${best.gw})`,
        description:
          "The Special One — highest score in a gameweek where a chip was played",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `${second.points} pts (${second.chipName}, GW${second.gw})`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-weekend-at-bernies",
    name: "The Weekend At Bernies",
    emoji: "🏖️",
    image: "weekend-at-bernies.gif",
    gradient: "from-lime-500 to-emerald-700",
    compute: (input: AwardInput) => {
      let best: { entry: AwardEntry; gw: number; points: number } | null =
        null;
      let second: { entry: AwardEntry; gw: number; points: number } | null =
        null;

      for (const entry of input.entries) {
        for (const gw of entry.history.current) {
          if (gw.event_transfers === 0) {
            if (!best || gw.points > best.points) {
              second = best;
              best = { entry, gw: gw.event, points: gw.points };
            } else if (!second || gw.points > second.points) {
              second = { entry, gw: gw.event, points: gw.points };
            }
          }
        }
      }

      if (!best) return null;

      return {
        id: "the-weekend-at-bernies",
        name: "The Weekend At Bernies",
        emoji: "🏖️",
        image: "weekend-at-bernies.gif",
        gradient: "from-lime-500 to-emerald-700",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `${best.points}`,
        statLabel: `pts in GW${best.gw} (0 transfers)`,
        description:
          "Dead but still doing well — highest gameweek score without making a single transfer",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `${second.points} pts (GW${second.gw})`,
            }
          : undefined,
      };
    },
  },

  {
    id: "the-bottle-job",
    name: "The Bottle Job",
    emoji: "🚢",
    image: "the-bottle-job.jpg",
    gradient: "from-blue-800 to-slate-900",
    compute: (input: AwardInput) => {
      if (input.entries.length === 0) return null;

      // Find the latest gameweek across all entries
      const allGws = new Set<number>();
      for (const entry of input.entries) {
        for (const gw of entry.history.current) {
          allGws.add(gw.event);
        }
      }
      if (allGws.size === 0) return null;

      const gwNumbers = Array.from(allGws).sort((a, b) => a - b);

      // For each gameweek, derive league positions by sorting entries by total_points
      // Track each entry's best (lowest number) position and their latest position
      const peakPositions = new Map<number, number>(); // entry id -> best position
      const latestPositions = new Map<number, number>(); // entry id -> latest position

      for (const gwNum of gwNumbers) {
        // Get total_points for each entry at this GW
        const gwStandings: { entryId: number; totalPoints: number }[] = [];
        for (const entry of input.entries) {
          const gw = entry.history.current.find((g) => g.event === gwNum);
          if (gw) {
            gwStandings.push({ entryId: entry.entry, totalPoints: gw.total_points });
          }
        }

        // Sort descending by total_points to derive positions
        gwStandings.sort((a, b) => b.totalPoints - a.totalPoints);

        for (let i = 0; i < gwStandings.length; i++) {
          const pos = i + 1;
          const entryId = gwStandings[i].entryId;
          const currentPeak = peakPositions.get(entryId);
          if (currentPeak === undefined || pos < currentPeak) {
            peakPositions.set(entryId, pos);
          }
          latestPositions.set(entryId, pos);
        }
      }

      // Calculate drops for each entry
      const drops = input.entries
        .map((entry) => {
          const peak = peakPositions.get(entry.entry);
          const current = latestPositions.get(entry.entry);
          if (peak === undefined || current === undefined) return null;
          return { entry, peak, current, drop: current - peak };
        })
        .filter((d): d is NonNullable<typeof d> => d !== null && d.drop > 0);

      if (drops.length === 0) return null;

      drops.sort((a, b) => b.drop - a.drop);
      const best = drops[0];
      const second = drops[1];

      return {
        id: "the-bottle-job",
        name: "The Bottle Job",
        emoji: "🚢",
        image: "the-bottle-job.jpg",
        gradient: "from-blue-800 to-slate-900",
        winner: {
          entry_name: best.entry.entry_name,
          player_name: best.entry.player_name,
        },
        heroStat: `↓${best.drop}`,
        statLabel: `places from peak (${best.peak} → ${best.current})`,
        description:
          "Unsinkable? Think again — biggest fall from peak league position",
        runnerUp: second
          ? {
              entry_name: second.entry.entry_name,
              player_name: second.entry.player_name,
              stat: `↓${second.drop} (${second.peak} → ${second.current})`,
            }
          : undefined,
      };
    },
  },
];
