/**
 * D&D 5e game constants used by the backend for computed stats,
 * rest logic, and template generation.
 *
 * All slot table values are from the Player's Handbook (2024).
 * High-magic levels 10–12 use the same slot count as level 9 (5 slots each)
 * as a sensible homebrew default.
 */

// ── Cantrip scaling ───────────────────────────────────────────────────────────

/**
 * Returns the cantrip damage-dice count tier for a given character level.
 * Standard 5e thresholds: 1–4 → 1 die, 5–10 → 2 dice, 11–16 → 3 dice, 17+ → 4 dice.
 */
export function cantripTierForLevel(charLevel: number): number {
  if (charLevel >= 17) return 4;
  if (charLevel >= 11) return 3;
  if (charLevel >= 5) return 2;
  return 1;
}

// ── Spell Save DC / Attack Bonus ──────────────────────────────────────────────

export function spellSaveDC(mod: number, prof: number): number {
  return 8 + prof + mod;
}

export function attackBonus(mod: number, prof: number): number {
  return prof + mod;
}

// ── Spell slot tables ─────────────────────────────────────────────────────────

/**
 * Full Caster slot table indexed by [characterLevel - 1][spellLevel - 1].
 * Covers spell levels 1–9.
 */
export const FULL_CASTER_SLOTS: number[][] = [
  // lvl /  1  2  3  4  5  6  7  8  9
  /*  1 */ [2, 0, 0, 0, 0, 0, 0, 0, 0],
  /*  2 */ [3, 0, 0, 0, 0, 0, 0, 0, 0],
  /*  3 */ [4, 2, 0, 0, 0, 0, 0, 0, 0],
  /*  4 */ [4, 3, 0, 0, 0, 0, 0, 0, 0],
  /*  5 */ [4, 3, 2, 0, 0, 0, 0, 0, 0],
  /*  6 */ [4, 3, 3, 0, 0, 0, 0, 0, 0],
  /*  7 */ [4, 3, 3, 1, 0, 0, 0, 0, 0],
  /*  8 */ [4, 3, 3, 2, 0, 0, 0, 0, 0],
  /*  9 */ [4, 3, 3, 3, 1, 0, 0, 0, 0],
  /* 10 */ [4, 3, 3, 3, 2, 0, 0, 0, 0],
  /* 11 */ [4, 3, 3, 3, 2, 1, 0, 0, 0],
  /* 12 */ [4, 3, 3, 3, 2, 1, 0, 0, 0],
  /* 13 */ [4, 3, 3, 3, 2, 1, 1, 0, 0],
  /* 14 */ [4, 3, 3, 3, 2, 1, 1, 0, 0],
  /* 15 */ [4, 3, 3, 3, 2, 1, 1, 1, 0],
  /* 16 */ [4, 3, 3, 3, 2, 1, 1, 1, 0],
  /* 17 */ [4, 3, 3, 3, 2, 1, 1, 1, 1],
  /* 18 */ [4, 3, 3, 3, 3, 1, 1, 1, 1],
  /* 19 */ [4, 3, 3, 3, 3, 2, 1, 1, 1],
  /* 20 */ [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/**
 * Half Caster (Paladin / Ranger) slot table.
 * Half casters gain spell slots starting at character level 2.
 */
export const HALF_CASTER_SLOTS: number[][] = [
  // lvl /  1  2  3  4  5  6  7  8  9
  /*  1 */ [0, 0, 0, 0, 0, 0, 0, 0, 0],
  /*  2 */ [2, 0, 0, 0, 0, 0, 0, 0, 0],
  /*  3 */ [3, 0, 0, 0, 0, 0, 0, 0, 0],
  /*  4 */ [3, 0, 0, 0, 0, 0, 0, 0, 0],
  /*  5 */ [4, 2, 0, 0, 0, 0, 0, 0, 0],
  /*  6 */ [4, 2, 0, 0, 0, 0, 0, 0, 0],
  /*  7 */ [4, 3, 0, 0, 0, 0, 0, 0, 0],
  /*  8 */ [4, 3, 0, 0, 0, 0, 0, 0, 0],
  /*  9 */ [4, 3, 2, 0, 0, 0, 0, 0, 0],
  /* 10 */ [4, 3, 2, 0, 0, 0, 0, 0, 0],
  /* 11 */ [4, 3, 3, 0, 0, 0, 0, 0, 0],
  /* 12 */ [4, 3, 3, 0, 0, 0, 0, 0, 0],
  /* 13 */ [4, 3, 3, 1, 0, 0, 0, 0, 0],
  /* 14 */ [4, 3, 3, 1, 0, 0, 0, 0, 0],
  /* 15 */ [4, 3, 3, 2, 0, 0, 0, 0, 0],
  /* 16 */ [4, 3, 3, 2, 0, 0, 0, 0, 0],
  /* 17 */ [4, 3, 3, 3, 1, 0, 0, 0, 0],
  /* 18 */ [4, 3, 3, 3, 1, 0, 0, 0, 0],
  /* 19 */ [4, 3, 3, 3, 2, 0, 0, 0, 0],
  /* 20 */ [4, 3, 3, 3, 2, 0, 0, 0, 0],
];

/**
 * Warlock (Pact Magic) slot progression by character level.
 * Returns { slots, slotLevel } — pact slots are all the same level.
 */
export const WARLOCK_PACT: { slots: number; slotLevel: number }[] = [
  /*  1 */ { slots: 1, slotLevel: 1 },
  /*  2 */ { slots: 2, slotLevel: 1 },
  /*  3 */ { slots: 2, slotLevel: 2 },
  /*  4 */ { slots: 2, slotLevel: 2 },
  /*  5 */ { slots: 2, slotLevel: 3 },
  /*  6 */ { slots: 2, slotLevel: 3 },
  /*  7 */ { slots: 2, slotLevel: 4 },
  /*  8 */ { slots: 2, slotLevel: 4 },
  /*  9 */ { slots: 2, slotLevel: 5 },
  /* 10 */ { slots: 2, slotLevel: 5 },
  /* 11 */ { slots: 3, slotLevel: 5 },
  /* 12 */ { slots: 3, slotLevel: 5 },
  /* 13 */ { slots: 3, slotLevel: 5 },
  /* 14 */ { slots: 3, slotLevel: 5 },
  /* 15 */ { slots: 3, slotLevel: 5 },
  /* 16 */ { slots: 3, slotLevel: 5 },
  /* 17 */ { slots: 4, slotLevel: 5 },
  /* 18 */ { slots: 4, slotLevel: 5 },
  /* 19 */ { slots: 4, slotLevel: 5 },
  /* 20 */ { slots: 4, slotLevel: 5 },
];

// ── Arcanum unlock levels ─────────────────────────────────────────────────────

/** Character levels at which Mystic Arcanum slots are unlocked and their spell level */
export const ARCANUM_UNLOCKS: { charLevel: number; spellLevel: number }[] = [
  { charLevel: 11, spellLevel: 6 },
  { charLevel: 13, spellLevel: 7 },
  { charLevel: 15, spellLevel: 8 },
  { charLevel: 17, spellLevel: 9 },
];

// ── Template types ────────────────────────────────────────────────────────────

export type CasterTemplate = 'full' | 'half' | 'warlock';
