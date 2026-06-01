import type { Spell } from "../../types";

/**
 * Formats a numeric bonus as a signed string.
 * @example fmtBonus(5)  // → "+ 5"
 * @example fmtBonus(-1) // → "-1"
 */
export function fmtBonus(n: number): string {
  return n >= 0 ? `+ ${n}` : `${n}`;
}

/**
 * Returns a human-readable label for a spell level.
 * @example levelLabel("cantrip") // → "Cantrip"
 * @example levelLabel("3")       // → "Level 3"
 */
export function levelLabel(level: string): string {
  if (level === "cantrip") return "Cantrip";
  return `Level ${level}`;
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
