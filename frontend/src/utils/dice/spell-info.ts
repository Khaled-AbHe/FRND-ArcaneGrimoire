import type { ComputedStats, OutputType, Spell } from "../../types";
import { cantripDiceCount, cantripProjCount } from "./cantrip";
import { upcastSteps } from "./core";

/**
 * Returns the hit roll label or save DC string for a spell.
 * - Attack spells: "+5"
 * - Save spells:   "CON 14"
 * - Neither:       "—"
 */
export function spellHitDC(spell: Spell, stats: ComputedStats): string {
  const st = spell.spellType;
  if (st.kind === "save") return `${st.saveAbility.slice(0, 3).toUpperCase()} ${stats.spellSaveDC}`;
  if (st.kind === "attack") return `+${stats.attackBonus}`;
  return "—";
}

/**
 * Returns a compact damage/effect string for a spell at a given slot level.
 * Accounts for upcast scaling, cantrip level scaling, and projectile counts.
 *
 * @example spellEffect(fireball, stats, 5) // → "10d6"
 * @example spellEffect(firebolt, stats, 0) // → "2d10" (at char level 5)
 * @example spellEffect(magicMissile, stats, 2) // → "4 darts"
 */
export function spellEffect(spell: Spell, stats: ComputedStats, slotLevel: number): string {
  const out = spell.outputType;
  const isCantrip = spell.level === "cantrip";

  if (out.kind === "utility") return "";

  if (out.kind === "cantrip") {
    const d = out.dice[0];
    if (!d) return "—";
    const count = cantripDiceCount(spell, stats.charLevel);
    const mod = d.addCastingMod ? `+${stats.spellMod}` : "";
    return `${count}${d.die}${mod}`;
  }

  if (out.dice.length === 0 && !out.projectiles) return "—";

  const totals: Record<string, { count: number; flatBonus: number; addMod: boolean }> = {};

  for (const d of out.dice) {
    const key = `${d.die}:${d.type}`;
    if (!totals[key]) totals[key] = { count: 0, flatBonus: 0, addMod: false };
    totals[key].count += d.count;
    totals[key].flatBonus += d.flatBonus ?? 0;
    if (d.addCastingMod) totals[key].addMod = true;
  }

  if (!isCantrip && out.upcast?.dice && slotLevel > 0) {
    for (const u of out.upcast.dice) {
      const steps = upcastSteps(u.everyNLevels, u.aboveLevel, slotLevel);
      if (steps <= 0) continue;
      const key = `${u.die}:${u.type}`;
      if (!totals[key]) totals[key] = { count: 0, flatBonus: 0, addMod: false };
      totals[key].count += u.count * steps;
      totals[key].flatBonus += (u.flatBonus ?? 0) * steps;
    }
  }

  const parts = Object.entries(totals)
    .map(([key, { count, flatBonus, addMod }]) => {
      const die = key.split(":")[0];
      let s = count > 0 ? `${count}${die}` : "";
      if (flatBonus) s += `+${flatBonus}`;
      if (addMod && stats.spellMod) s += `+${stats.spellMod}`;
      return s;
    })
    .filter(Boolean);

  if (parts.length === 0) {
    if (out.projectiles) {
      let proj = out.projectiles.baseCount;
      if (out.projectiles.upcast && slotLevel > 0) {
        const { count, everyNLevels, aboveLevel } = out.projectiles.upcast;
        proj += upcastSteps(everyNLevels, aboveLevel, slotLevel) * count;
      }
      return `${proj} darts`;
    }
    return "—";
  }

  return parts.join(" + ");
}

/**
 * Returns a compact notes string for a spell row — duration and components.
 * Concentration prefix ("C:") and units are shortened for space.
 * @example spellNotes(hypnoticPattern) // → "C: 1m, V/S/M"
 */
export function spellNotes(spell: Spell): string {
  const c = spell.components;
  const parts: string[] = [];

  if (spell.duration && spell.duration !== "Instantaneous") {
    const short = spell.duration
      .replace("Concentration, up to ", "C: ")
      .replace(" minutes", "m")
      .replace(" minute", "m")
      .replace(" hours", "h")
      .replace(" hour", "h");
    parts.push(short);
  }

  const compStr = [c.verbal && "V", c.somatic && "S", c.material && "M"].filter(Boolean).join("/");
  if (compStr) parts.push(compStr);

  return parts.join(", ");
}

/**
 * Returns the total number of dice rolled when casting a spell at a given slot level.
 *
 * - Cantrips (dice-scaling): resolves die count via character level thresholds.
 * - Cantrips (projectile-scaling): returns beam/projectile count.
 * - Leveled projectile spells (e.g. Magic Missile): returns dart count including upcast.
 * - Leveled dice spells: sums base dice + upcast dice for the slot level.
 * - Utility spells: returns 0.
 *
 * @param spell     - The spell being cast
 * @param slotLevel - The slot level used (ignored for cantrips)
 * @param charLevel - Character level, used for cantrip scaling (default 1)
 */
export function getTotalDiceCount(
  spell: Spell,
  spellLevel: string,
  dmgType: OutputType,
  charLevel = 1,
): number {
  const out = spell.outputType;
  const slotLevel = spellLevel === "cantrip" ? 0 : Number(spellLevel);

  if (out.kind === "utility") return 0;

  if (out.kind === "cantrip") {
    return out.dice.reduce(
      (sum, d) => sum + cantripDiceCount(spell, charLevel) * (d.count > 0 ? 1 : 0),
      0,
    );
  }

  if (out.kind === "leveled") {
    const dice = out.dice.filter((d) => d.type == dmgType);
    const baseDice = dice.reduce((sum, d) => sum + d.count, 0);

    let upcastDice = 0;
    if (out.upcast?.dice && slotLevel > 0) {
      for (const u of out.upcast.dice) {
        const steps = upcastSteps(u.everyNLevels, u.aboveLevel, slotLevel);
        if (steps > 0 && u.type === dmgType) upcastDice += u.count * steps;
      }
    }
    return baseDice + upcastDice;
  }

  return 0;
}

export function getTotalProjCount(spell: Spell, spellLevel: string, charLevel = 1): number {
  const out = spell.outputType;
  const slotLevel = spellLevel === "cantrip" ? 0 : Number(spellLevel);

  if (out.kind === "utility") return 0;

  if (out.kind === "cantrip") {
    return cantripProjCount(spell, charLevel);
  }

  if (out.kind === "leveled" && out.projectiles) {
    let proj = out.projectiles.baseCount;
    if (out.projectiles.upcast && slotLevel > 0) {
      const { count, everyNLevels, aboveLevel } = out.projectiles.upcast;
      proj += upcastSteps(everyNLevels, aboveLevel, slotLevel) * count;
    }
    return proj;
  }

  return 0;
}
