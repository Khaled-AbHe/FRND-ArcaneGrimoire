import type { Spell } from "../../types";

/**
 * Resolves the dice count for a dice-scaling cantrip at the given character level.
 * Uses the spell's `outputType.scaling` thresholds (e.g. Fire Bolt: 1d10 → 2d10 at level 5).
 *
 * Returns 0 if the spell is not a cantrip or has no scaling defined.
 */
export function cantripDiceCount(spell: Spell, charLevel: number): number {
  const out = spell.outputType;
  if (out.kind !== "cantrip" || !out.scaling) return 0;
  const sorted = [...out.scaling].sort((a, b) => b.characterLevel - a.characterLevel);
  const match = sorted.find((s) => charLevel >= s.characterLevel);
  return match?.diceCount ?? 1;
}

/**
 * Resolves the projectile count for a projectile-scaling cantrip at the given character level.
 * Used for spells like Eldritch Blast where the number of beams scales with level.
 *
 * Returns 1 if the spell is not a cantrip or has no projectile scaling.
 */
export function cantripProjCount(spell: Spell, charLevel: number): number {
  const out = spell.outputType;
  if (out.kind !== "cantrip") return 1;
  const sorted = [...out.scaling].sort((a, b) => b.characterLevel - a.characterLevel);
  const match = sorted.find((s) => charLevel >= s.characterLevel);
  return match?.projCount ?? 1;
}
