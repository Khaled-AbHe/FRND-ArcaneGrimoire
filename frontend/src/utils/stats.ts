// utils/stats.ts
import type { Character, ComputedStats } from "../types";

const DEFAULT_GLOBALS = { mod: 3, prof: 2, charLevel: 1, highMagic: false };

// const DEFAULT_PACT = {
//   enabled: false,
//   slots: 0,
//   slotLevel: 1,
//   used: 0,
//   arcana: [],
// };

export function computeStats(char: Character): ComputedStats {
  const g = char.globals ?? DEFAULT_GLOBALS;
  const spellSaveDC = 8 + g.prof + g.mod;
  const attackBonus = g.prof + g.mod;
  const charLevel = g.charLevel ?? 1;
  let cantripTier = 1;
  if (charLevel >= 17) cantripTier = 4;
  else if (charLevel >= 11) cantripTier = 3;
  else if (charLevel >= 5) cantripTier = 2;
  return { spellSaveDC, attackBonus, cantripTier, charLevel, spellMod: g.mod };
}
