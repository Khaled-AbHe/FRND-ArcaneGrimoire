import type {
  Spell,
  ComputedStats,
  CastResult,
  ProjectileResult,
  DiceEntry,
  LevelRow,
} from "../types";
import type { HitRollResult, DamageRollResult } from "../components/ui/RollOverlay";

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function parseDie(die: string): number {
  return parseInt(die.replace("d", ""), 10);
}

/** Resolve cantrip dice count from scaling thresholds and character level */
export function cantripDiceCount(spell: Spell, charLevel: number): number {
  const out = spell.outputType;
  if (out.kind !== "cantrip" || !out.scaling) return 0;
  const sorted = [...out.scaling].sort((a, b) => b.characterLevel - a.characterLevel);
  const match = sorted.find((s) => charLevel >= s.characterLevel);
  return match?.diceCount ?? 1;
}

/** Resolve cantrip projectile count from scaling thresholds and character level */
export function cantripProjCount(spell: Spell, charLevel: number): number {
  const out = spell.outputType;
  if (out.kind !== "cantrip") return 1;
  const sorted = [...out.scaling].sort((a, b) => b.characterLevel - a.characterLevel);
  const match = sorted.find((s) => charLevel >= s.characterLevel);
  return match?.projCount ?? 1;
}

/** How many upcast steps apply for a given slot level */
function upcastSteps(everyNLevels: number, aboveLevel: number, slotLevel: number): number {
  const levelsAbove = Math.max(0, slotLevel - aboveLevel);
  return Math.floor(levelsAbove / everyNLevels);
}

export function rollSpell(spell: Spell, stats: ComputedStats, slotLevel: number): CastResult {
  const isCantrip = spell.level === "cantrip";
  const out = spell.outputType;
  const st = spell.spellType;

  // ── Determine projectile count ─────────────────────────────────────────────
  let projCount = 1;

  if (out.kind === "cantrip" && out.scaling.length > 0) {
    // Check if scaling entries use projCount (e.g. Eldritch Blast) or diceCount
    const usesProjScaling = out.scaling.some((s) => s.projCount != null);
    if (usesProjScaling) {
      projCount = cantripProjCount(spell, stats.charLevel);
    }
    // diceCount cantrips stay at 1 projectile; the count is applied per-die below
  } else if (out.kind === "leveled" && out.projectiles) {
    projCount = out.projectiles.baseCount;
    if (out.projectiles.upcast) {
      const { count, everyNLevels, aboveLevel } = out.projectiles.upcast;
      projCount += upcastSteps(everyNLevels, aboveLevel, slotLevel) * count;
    }
  }

  // ── Roll each projectile ───────────────────────────────────────────────────
  const projectiles: ProjectileResult[] = [];

  for (let p = 0; p < projCount; p++) {
    let d20Val: number | null = null;
    let bonus: number | null = null;
    let total: number | null = null;
    let isCrit = false;
    let isMiss = false;

    if (st.kind === "attack") {
      d20Val = rollDie(20);
      bonus = stats.attackBonus;
      total = d20Val + bonus;
      isCrit = d20Val >= (st.critRange ?? 20);
      isMiss = d20Val === 1;
    }

    const damageRolls: ProjectileResult["damageRolls"] = [];
    const totals: Record<string, number> = {};
    let damageModifier = 0;
    const multiplier = isCrit ? 2 : 1;

    // ── Base dice ────────────────────────────────────────────────────────────
    const baseDice: DiceEntry[] = (() => {
      if (out.kind === "utility") return [];

      if (out.kind === "cantrip") {
        // For proj-scaling cantrips (Eldritch Blast): 1 die per beam
        // For dice-scaling cantrips (Fire Bolt): scale count here
        const usesProjScaling = out.scaling.some((s) => s.projCount != null);
        return out.dice.map((d) => ({
          ...d,
          count: usesProjScaling ? d.count : cantripDiceCount(spell, stats.charLevel),
        }));
      }

      // leveled — base dice only (no projectiles field means single-target)
      return out.dice;
    })();

    for (const d of baseDice) {
      const sides = parseDie(d.die);
      const rollCount = d.count * multiplier;
      for (let i = 0; i < rollCount; i++) {
        const result = sides > 0 ? rollDie(sides) : 0;
        if (sides > 0) damageRolls.push({ die: d.die, result, type: d.type });
        totals[d.type] = (totals[d.type] ?? 0) + result;
      }
      if (d.addCastingMod) {
        totals[d.type] = (totals[d.type] ?? 0) + stats.spellMod;
        damageModifier += stats.spellMod;
      }
      if (d.flatBonus) {
        totals[d.type] = (totals[d.type] ?? 0) + d.flatBonus;
        damageModifier += d.flatBonus;
      }
    }

    // ── Upcast dice (leveled spells only) ────────────────────────────────────
    if (!isCantrip && out.kind === "leveled" && out.upcast?.dice && slotLevel > 0) {
      for (const u of out.upcast.dice) {
        const steps = upcastSteps(u.everyNLevels, u.aboveLevel, slotLevel);
        if (steps <= 0) continue;
        const sides = parseDie(u.die);
        if (u.count > 0 && sides > 0) {
          const rollCount = u.count * steps * multiplier;
          for (let i = 0; i < rollCount; i++) {
            const result = rollDie(sides);
            damageRolls.push({ die: u.die, result, type: u.type });
            totals[u.type] = (totals[u.type] ?? 0) + result;
          }
        }
        if (u.flatBonus) {
          totals[u.type] = (totals[u.type] ?? 0) + u.flatBonus * steps;
          damageModifier += u.flatBonus * steps;
        }
      }
    }

    const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

    projectiles.push({
      attackRoll: st.kind === "attack" && d20Val !== null ? { sides: 20, result: d20Val } : null,
      d20: d20Val,
      bonus,
      total,
      isCrit,
      isMiss,
      damageRolls,
      damageTotals: totals,
      damageModifier,
      grandTotal,
    });
  }

  const overallTotal = projectiles.reduce((s, p) => s + p.grandTotal, 0);
  const anyCrit = projectiles.some((p) => p.isCrit);

  return {
    spellName: spell.name,
    slotLevel: isCantrip ? "cantrip" : slotLevel,
    saveDC: st.kind === "save" ? stats.spellSaveDC : null,
    attackBonus: st.kind === "attack" ? stats.attackBonus : null,
    projectiles,
    grandTotal: overallTotal,
    isCrit: anyCrit,
    spellModifier: stats.spellMod,
  };
}

/** Format a signed number e.g. +5 or -1 */
export function fmtBonus(n: number): string {
  return n >= 0 ? `+ ${n}` : `${n}`;
}

/** Spell level display label */
export function levelLabel(level: string): string {
  if (level === "cantrip") return "Cantrip";
  return `Level ${level}`;
}

/** Get the slot level to use when casting from a level row */
export function slotLevelFromLabel(label: string): number {
  const match = label.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

/** Sum total/used across all level rows for a quick overview */
export function slotSummary(levels: LevelRow[]): { total: number; used: number } {
  return levels.reduce((acc, l) => ({ total: acc.total + l.total, used: acc.used + l.used }), {
    total: 0,
    used: 0,
  });
}

/** Human-readable string for a spell's components */
export function formatComponents(c: Spell["components"]): string {
  const parts: string[] = [];
  if (c.verbal) parts.push("V");
  if (c.somatic) parts.push("S");
  if (c.material) parts.push(`M (${c.material})`);
  return parts.join(", ") || "—";
}

export function spellHitDC(spell: Spell, stats: ComputedStats): string {
  const st = spell.spellType;
  if (st.kind === "save") return `${st.saveAbility.slice(0, 3).toUpperCase()} ${stats.spellSaveDC}`;
  if (st.kind === "attack") return `+${stats.attackBonus}`;
  return "—";
}

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
      const steps = Math.max(0, Math.floor((slotLevel - u.aboveLevel) / u.everyNLevels));
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
        proj += Math.max(0, Math.floor((slotLevel - aboveLevel) / everyNLevels)) * count;
      }
      return `${proj} darts`;
    }
    return "—";
  }
  return parts.join(" + ");
}

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

export type RollMode = "normal" | "advantage" | "disadvantage";

export function buildHitRoll(
  spell: Spell,
  stats: ComputedStats,
  id: number,
  mode: RollMode = "normal",
): HitRollResult {
  const st = spell.spellType;
  const critRange = st.kind === "attack" ? (st.critRange ?? 20) : 20;
  const bonus = stats.attackBonus;

  if (mode === "normal") {
    const d20 = rollDie(20);
    return {
      kind: "hit",
      d20,
      bonus,
      total: d20 + bonus,
      isCrit: d20 >= critRange,
      isMiss: d20 === 1,
      mode,
      id,
    };
  }

  const roll1 = rollDie(20);
  const roll2 = rollDie(20);
  const d20 = mode === "advantage" ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
  const discarded = mode === "advantage" ? Math.min(roll1, roll2) : Math.max(roll1, roll2);

  return {
    kind: "hit",
    d20,
    bonus,
    total: d20 + bonus,
    isCrit: d20 >= critRange,
    isMiss: d20 === 1,
    mode,
    discarded,
    id,
  };
}

export function buildDamageRoll(
  spell: Spell,
  stats: ComputedStats,
  slotLevel: number,
  id: number,
  isCrit = false,
): DamageRollResult {
  const out = spell.outputType;
  const rolls: DamageRollResult["rolls"] = [];
  let modifier = 0;
  const multiplier = isCrit ? 2 : 1;

  if (out.kind === "utility") {
    return { kind: "damage", rolls: [], modifier: 0, grandTotal: 0, id, isCrit };
  }

  if (out.kind === "cantrip") {
    const usesProjScaling = out.scaling.some((s) => s.projCount != null);
    for (const d of out.dice) {
      const sides = parseDie(d.die);
      const count =
        (usesProjScaling ? d.count : cantripDiceCount(spell, stats.charLevel)) * multiplier;
      for (let i = 0; i < count; i++)
        rolls.push({ die: d.die, result: rollDie(sides), type: d.type });
      if (d.addCastingMod) modifier += stats.spellMod;
      if (d.flatBonus) modifier += d.flatBonus;
    }
  } else if (out.kind === "leveled") {
    // Base dice
    for (const d of out.dice) {
      const sides = parseDie(d.die);
      for (let i = 0; i < d.count * multiplier; i++)
        rolls.push({ die: d.die, result: rollDie(sides), type: d.type });
      if (d.addCastingMod) modifier += stats.spellMod;
      if (d.flatBonus) modifier += d.flatBonus;
    }
    // Upcast dice
    if (out.upcast?.dice && slotLevel > 0) {
      for (const u of out.upcast.dice) {
        const steps = Math.max(0, Math.floor((slotLevel - u.aboveLevel) / u.everyNLevels));
        if (steps <= 0) continue;
        const sides = parseDie(u.die);
        if (u.count > 0 && sides > 0) {
          for (let i = 0; i < u.count * steps * multiplier; i++)
            rolls.push({ die: u.die, result: rollDie(sides), type: u.type });
        }
        if (u.flatBonus) modifier += u.flatBonus * steps;
      }
    }
  }

  const diceTotal = rolls.reduce((s, r) => s + r.result, 0);
  return { kind: "damage", rolls, modifier, grandTotal: diceTotal + modifier, id, isCrit };
}
