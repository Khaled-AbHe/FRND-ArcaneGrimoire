import type { LevelRow } from "../../types";

/**
 * Extracts the numeric spell level from a level row label.
 * Returns 1 as a fallback if no number is found.
 * @example slotLevelFromLabel("Level 3") // → 3
 * @example slotLevelFromLabel("Cantrip") // → 1
 */
export function slotLevelFromLabel(label: string): number {
  const match = label.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

/**
 * Aggregates total and used slot counts across all level rows.
 * Useful for rendering a quick overview badge in the header.
 * @example slotSummary([{ total: 4, used: 2 }, { total: 2, used: 1 }])
 * // → { total: 6, used: 3 }
 */
export function slotSummary(levels: LevelRow[]): { total: number; used: number } {
  return levels.reduce(
    (acc, l) => ({ total: acc.total + l.total, used: acc.used + l.used }),
    { total: 0, used: 0 },
  );
}
