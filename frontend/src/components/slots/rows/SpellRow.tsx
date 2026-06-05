import { useState } from "react";
import type { Spell, LevelRow, ComputedStats } from "../../../types";
import {
  buildDamageRoll,
  buildHitRoll,
  DamageMode,
  fmtCastTime,
  parseSpellLevel,
  type RollMode,
  spellEffect,
  spellHitDC,
  spellNotes,
} from "../../../utils/dice";
import type { DamageRollResult, HitRollResult } from "../../ui/RollOverlay";
import { ActionButton } from "../ActionButton";
import { ContextButton } from "../../ui/ContextMenu/ContextButton";

export interface SpellRowVariant {
  kind: "cast";
  row: LevelRow | null;
  isPactLevel: boolean;
  pactSlotsLeft: number;
  slotsLeft: number;
  isCantrip: boolean;
  canCast: boolean;
  castingSpellId: string | null;
  levelNum: number;
  onCastFromRow: (spell: Spell, row: LevelRow) => void;
  onCastFromPact: (spell: Spell) => void;
  setCastingSpellId: (id: string | null) => void;
}

export interface ArcanumRowVariant {
  kind: "arcanum";
  arcUsed: boolean;
  onCastArcanum: () => void;
  levelNum: number;
}

interface SpellRowProps {
  spell: Spell;
  stats: ComputedStats;
  variant: SpellRowVariant | ArcanumRowVariant;
  isLast: boolean;
  onViewDetail: (spell: Spell) => void;
  onRollHit: (result: HitRollResult) => void;
  onRollDamage: (result: DamageRollResult) => void;
  nextRollId: () => number;
}

export function SpellRow({
  spell,
  stats,
  variant,
  isLast,
  onViewDetail,
  onRollHit,
  onRollDamage,
  nextRollId,
}: SpellRowProps) {
  const [hitContextMenu, setHitContextMenu] = useState<boolean>(false);
  const [damageContextMenu, setDamageContextMenu] = useState<boolean>(false);

  const levelNum = variant.levelNum;
  const hitDC = spellHitDC(spell, stats);
  const effect = spellEffect(spell, stats, levelNum);
  const notes = spellNotes(spell);
  const hasAttack = spell.spellType.kind === "attack";
  const hasDamage =
    spell.outputType.kind !== "utility" && effect !== "—" && effect !== "";
  const rowSpell: Spell = parseSpellLevel(spell, levelNum);

  function fireHitRoll(mode: RollMode = "normal") {
    onRollHit(buildHitRoll(spell, stats, nextRollId(), mode));
    setHitContextMenu(false);
  }

  function fireDamageRoll(damage: DamageMode = "normal") {
    onRollDamage(
      buildDamageRoll(
        spell,
        stats,
        levelNum,
        nextRollId(),
        damage === "critical",
      ),
    );
    setDamageContextMenu(false);
  }

  return (
    <>
      <div
        className="flex items-center justify-between py-1 text-sm"
        style={{
          borderBottom: isLast ? "none" : "1px dotted var(--border)",
          background: "transparent",
        }}
        role="row"
      >
        {/* Action button (Cast or Arc) */}
        <ActionButton spell={spell} variant={variant} />

        {/* Name */}
        <div className="flex h-[35px] min-w-[290px] items-center justify-start p-1">
          <button
            className="min-w-0 cursor-pointer truncate text-left font-medium hover:underline"
            style={{
              color: "var(--text-secondary)",
              background: "none",
              border: "none",
            }}
            onClick={() => onViewDetail(rowSpell)}
            aria-label={`View details for ${spell.name}`}
          >
            {spell.name}
          </button>
        </div>

        {/* Time */}
        <div className="flex h-[35px] min-w-[70px] items-center justify-center p-1 text-xs text-[var(--text-secondary)]">
          {fmtCastTime(spell)}
        </div>

        {/* Range */}
        <div className="flex h-[35px] min-w-[70px] items-center justify-center p-1 text-xs text-[var(--text-secondary)]">
          {spell.range === "Self" || spell.range === "Touch" ? (
            spell.range
          ) : (
            <span>
              {spell.range?.replace(" feet", "").replace(" foot", "")} ft.
            </span>
          )}
        </div>

        {/* Hit / DC */}
        <div className="flex h-[35px] min-w-[90px] items-center justify-center p-1 text-center text-xs">
          {hasAttack ? (
            <ContextButton
              value={hitDC}
              title={"Click to roll · Right-click for advantage/disadvantage"}
              variant={variant}
              contextMenu={hitContextMenu}
              setContextMenu={setHitContextMenu}
              contextOptions={[
                {
                  effect: "normal" as RollMode,
                  label: "Normal Roll",
                  color: "var(--text-primary)",
                },
                {
                  effect: "advantage" as RollMode,
                  label: "Advantage",
                  color: "#34d399",
                },
                {
                  effect: "disadvantage" as RollMode,
                  label: "Disadvantage",
                  color: "#f87171",
                },
              ]}
              onClick={fireHitRoll}
            />
          ) : (
            <span className="text-[14px] text-[var(--text-secondary)]">
              {hitDC}
            </span>
          )}
        </div>

        {/* Effect */}
        <div className="flex h-[35px] min-w-[140px] items-center justify-center p-1">
          {hasDamage ? (
            <ContextButton
              value={effect}
              title={"Click to roll · Right-click for critical damage"}
              variant={variant}
              contextMenu={damageContextMenu}
              setContextMenu={setDamageContextMenu}
              contextOptions={[
                {
                  effect: "normal" as DamageMode,
                  label: "Normal Roll",
                  color: "var(--text-primary)",
                },
                {
                  effect: "critical" as DamageMode,
                  label: "Critical Hit",
                  color: "var(--crit-color, #ffd000)",
                },
              ]}
              onClick={fireDamageRoll}
            />
          ) : (
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {spell.outputType.kind === "utility"
                ? spell.spellType.kind === "save"
                  ? "Control"
                  : "Buff"
                : effect}
            </span>
          )}
        </div>

        {/* Notes */}
        <div className="flex h-[35px] min-w-[140px] items-center justify-start p-1">
          <span
            className="truncate text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {notes}
          </span>
        </div>
      </div>
    </>
  );
}
