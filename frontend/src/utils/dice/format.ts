import type { HitRollResult, LevelRow, Spell } from "../../types";

/**
 * Formats a numeric bonus as a signed string.
 * @example fmtBonus(5)  // → "+ 5"
 * @example fmtBonus(-1) // → "-1"
 */
export function fmtBonus(n: number): string {
  return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

/**
 * Returns a human-readable label for a spell level.
 * @example levelLabel("cantrip") // → "Cantrip"
 * @example levelLabel("3")       // → "Level 3"
 */
export function levelLabel(level: string): string;

export function levelLabel(level: number): string;

export function levelLabel(level: number | string): string {
  return level === 0 || level === "cantrip" ? "Cantrip" : `Level ${level}`;
}

/**
 * Returns a compact string representation of a spell's components.
 * Includes material component text in parentheses when present.
 * @example formatComponents({ verbal: true, somatic: true, material: "a pinch of sand" })
 * // → "V, S, M (a pinch of sand)"
 */
export function formatComponents(c: Spell["components"]): string {
  const parts: string[] = [];
  if (c.verbal) parts.push("V");
  if (c.somatic) parts.push("S");
  if (c.material) parts.push(`M (${c.material})`);
  return parts.join(", ") || "—";
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function schoolColor(school: string): string {
  const map: Record<string, string> = {
    illusion: "rgba(168, 85, 247)",
    evocation: "rgba(255, 50, 50)",
    conjuration: "rgba(14, 165, 233)",
    abjuration: "rgba(97, 102, 241)",
    divination: "rgba(234, 179, 8)",
    enchantment: "rgba(217, 70, 239)",
    necromancy: "rgba(16, 185, 129)",
    transmutation: "rgba(249, 115, 22)",
  };
  return map[school?.toLowerCase()] ?? "rgba(36, 237, 251, 0.9)";
}

export function fmtCastTime(spell: Spell) {
  return (
    spell.castTime
      ?.replace("Bonus Action", "1 BA")
      .replace("Action", "1 A")
      .replace("Reaction", "1 R")
      .replace(" or Ritual", "")
      .replace("1 minute", "1m") ?? "—"
  );
}

export function levelId(levelNum: number) {
  return `level_${levelNum}`;
}

export function levelNumFromRow(row: LevelRow): number {
  return parseInt(row.label.replace(/\D/g, ""), 10) || 0;
}

export function hitTheme(isCrit: boolean, isMiss: boolean) {
  if (isCrit)
    return {
      accent: "var(--crit-color)",
      border: "rgba(255, 208, 0, 0.7)",
      glow: "rgba(255, 208, 0, 0.3)",
      label: "var(--crit-color)",
    };
  if (isMiss)
    return {
      accent: "var(--miss-color)",
      border: "rgba(239, 68, 68, 0.7)",
      glow: "rgba(239, 68, 68, 0.2)",
      label: "var(--miss-color)",
    };
  return {
    accent: "var(--accent)",
    border: "rgba(0, 229, 255, 0.5)",
    glow: "rgba(0, 229, 255, 0.2)",
    label: "var(--text-muted)",
  };
}

/** Returns badge styles for advantage/disadvantage mode labels. */
export function modeTheme(mode: HitRollResult["mode"]) {
  if (mode === "advantage")
    return {
      label: "ADVANTAGE",
      bg: "rgba(52, 211, 153, 0.15)",
      fg: "#34d399",
    };
  if (mode === "disadvantage")
    return {
      label: "DISADVANTAGE",
      bg: "rgba(248, 113, 113, 0.15)",
      fg: "#f87171",
    };
  return null;
}

export function shuffleImmutable<T>(array: T[]): T[] {
  // Create a shallow copy first
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
