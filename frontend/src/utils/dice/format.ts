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

export function schoolColor(school: string): string {
  const map: Record<string, string> = {
    illusion: "rgba(168,85,247)",
    evocation: "rgba(255,80,80)",
    conjuration: "rgba(14,165,233)",
    abjuration: "rgba(97,102,241)",
    divination: "rgba(234,179,8)",
    enchantment: "rgba(217,70,239)",
    necromancy: "rgba(16,185,129)",
    transmutation: "rgba(249,115,22)",
  };
  return map[school?.toLowerCase()] ?? "rgba(36,237,251,0.9)";
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
