import type {
  CastResult,
  ComputedStats,
  DiceEntry,
  ProjectileResult,
  Spell,
} from "../../types";
import type {
  DamageRollResult,
  HitRollResult,
} from "../../components/ui/RollOverlay";
import { cantripDiceCount, cantripProjCount } from "./cantrip";
import { parseDie, rollDie, upcastSteps } from "./core";

/** Controls whether a hit roll uses straight, advantage, or disadvantage. */
export type RollMode = "normal" | "advantage" | "disadvantage";

/**
 * Fully rolls a spell cast — resolves projectile count, attack rolls,
 * base dice, upcast dice, and aggregates totals.
 *
 * This is the comprehensive roll used for the cast overlay. For individual
 * hit/damage buttons in the slot row, use `buildHitRoll` and `buildDamageRoll`.
 *
 * @param spell     - The spell being cast
 * @param stats     - Computed character stats (attack bonus, spell mod, etc.)
 * @param slotLevel - Slot level used; pass charLevel for cantrip scaling
 */
export function rollSpell(
  spell: Spell,
  stats: ComputedStats,
  slotLevel: number,
): CastResult {
  const isCantrip = spell.level === "cantrip";
  const out = spell.outputType;
  const st = spell.spellType;

  // ── Projectile count ───────────────────────────────────────────────────────
  let projCount = 1;

  if (out.kind === "cantrip" && out.scaling.length > 0) {
    const usesProjScaling = out.scaling.some((s) => s.projCount != null);
    if (usesProjScaling) {
      projCount = cantripProjCount(spell, stats.charLevel);
    }
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
        const usesProjScaling = out.scaling.some((s) => s.projCount != null);
        return out.dice.map((d) => ({
          ...d,
          count: usesProjScaling
            ? d.count
            : cantripDiceCount(spell, stats.charLevel),
        }));
      }
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

    // ── Upcast dice ──────────────────────────────────────────────────────────
    if (
      !isCantrip &&
      out.kind === "leveled" &&
      out.upcast?.dice &&
      slotLevel > 0
    ) {
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
      attackRoll:
        st.kind === "attack" && d20Val !== null
          ? { sides: 20, result: d20Val }
          : null,
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

/**
 * Builds a hit roll result for the slot row hit button.
 * Supports normal, advantage, and disadvantage modes.
 * For the full cast (all projectiles), use `rollSpell` instead.
 *
 * @param spell - The spell being rolled
 * @param stats - Computed character stats
 * @param id    - Unique roll id for the overlay
 * @param mode  - Roll mode: normal, advantage, or disadvantage
 */
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
  const d20 =
    mode === "advantage" ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
  const discarded =
    mode === "advantage" ? Math.min(roll1, roll2) : Math.max(roll1, roll2);

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

/**
 * Builds a damage roll result for the slot row damage button.
 * Handles base dice, upcast dice, casting mod bonuses, and critical hits (doubled dice).
 * For the full cast (all projectiles + attack roll), use `rollSpell` instead.
 *
 * @param spell     - The spell being rolled
 * @param stats     - Computed character stats
 * @param slotLevel - Slot level used for upcast calculation
 * @param id        - Unique roll id for the overlay
 * @param isCrit    - Whether to double all dice (critical hit)
 */
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
    return {
      kind: "damage",
      rolls: [],
      modifier: 0,
      grandTotal: 0,
      id,
      isCrit,
    };
  }

  if (out.kind === "cantrip") {
    const usesProjScaling = out.scaling.some((s) => s.projCount != null);
    for (const d of out.dice) {
      const sides = parseDie(d.die);
      const count =
        (usesProjScaling ? d.count : cantripDiceCount(spell, stats.charLevel)) *
        multiplier;
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
        const steps = upcastSteps(u.everyNLevels, u.aboveLevel, slotLevel);
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
  return {
    kind: "damage",
    rolls,
    modifier,
    grandTotal: diceTotal + modifier,
    id,
    isCrit,
  };
}
