// utils/stats.ts
import type { Character, ComputedStats, Spell } from "../types";
import {
  cantripDiceCount,
  fmtBonus,
  formatComponents,
  getTotalDiceCount,
  getTotalProjCount,
} from "./dice";

const DEFAULT_GLOBALS = { mod: 3, prof: 2, charLevel: 1, highMagic: false };

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

export function buildGrid(spell: Spell, stats: ComputedStats, isPreparer: boolean) {
  const st = spell.spellType;
  let statGrid = [
    { label: "Casting Time", value: spell.castTime },
    { label: "Range", value: spell.range },
    { label: "Duration", value: spell.duration },
    { label: "Components", value: formatComponents(spell.components) },
  ];

  if (st.kind == "attack") {
    statGrid.push({ label: "Type", value: st.attackType });
  } else if (st.kind == "save") {
    statGrid.push({ label: "Type", value: `${st.saveAbility} Saving throw` });
  } else {
    statGrid.push({ label: "Type", value: "Utility" });
  }

  if (spell.outputType.kind != "utility") {
    statGrid.push({ label: "Damage", value: buildDamage(spell, stats, isPreparer) });
  }

  return statGrid;
}

export function buildDamage(spell: Spell, stats: ComputedStats, isPreparer: boolean) {
  const out = spell.outputType;
  let text = "";
  if (out.kind == "leveled") {
    out.dice.map((d) => {
      text += `${out.projectiles ? `${getTotalProjCount(spell, spell.level)} projectiles of ` : ""}${d.count > 0 ? `${getTotalDiceCount(spell, spell.level)}${d.die}` : ""} ${d.flatBonus ? ` + ${d.flatBonus}` : ""} ${d.addCastingMod ? (isPreparer ? `${fmtBonus(stats.spellMod)}` : ` + (Spell. Mod.)`) : ""} ${d.type} `;
    });
  } else if (out.kind == "cantrip") {
    out.dice.map((d) => {
      text += `${out.scaling[0].projCount ? `${getTotalProjCount(spell, spell.level, stats.charLevel)} projectiles of ` : ""}${cantripDiceCount(spell, stats.charLevel)}${d.die} ${d.addCastingMod ? ` + mod` : ""} ${d.type} `;
    });
  }

  return text;
}
