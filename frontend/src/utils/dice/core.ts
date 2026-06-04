import { Spell, SpellLevel } from "../../types";

/**
 * Rolls a single die with the given number of sides.
 * Returns a random integer between 1 and `sides` inclusive.
 */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Parses a die string (e.g. "d6", "d10") into its numeric side count.
 * Returns 0 if the string cannot be parsed.
 */
export function parseDie(die: string): number {
  return parseInt(die.replace("d", ""), 10);
}

/**
 * Updates the spell's level based on the spell row
 * @param spell
 * @param rowLevel
 * @returns Updated spell
 */
export function parseSpellLevel(spell: Spell, rowLevel: unknown): Spell {
  return {
    ...spell,
    level: rowLevel === 0 ? "cantrip" : (rowLevel as SpellLevel),
  };
}

/**
 * Calculates how many upcast steps apply for a given slot level.
 *
 * @param everyNLevels - How many levels above the base triggers one step
 * @param aboveLevel   - The base spell level above which upcasting begins
 * @param slotLevel    - The slot level being used to cast
 *
 * @example
 * // Hex Warrior: +1d6 for every level above 1st
 * upcastSteps(1, 1, 3) // → 2 (levels 2 and 3 above base)
 */
export function upcastSteps(
  everyNLevels: number,
  aboveLevel: number,
  slotLevel: number,
): number {
  const levelsAbove = Math.max(0, slotLevel - aboveLevel);
  return Math.floor(levelsAbove / everyNLevels);
}
