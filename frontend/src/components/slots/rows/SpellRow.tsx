import { useState } from "react";
import type { Spell, LevelRow, ComputedStats } from "../../../types";
import {
  buildDamageRoll,
  buildHitRoll,
  fmtCastTime,
  parseSpellLevel,
  type RollMode,
  spellEffect,
  spellHitDC,
  spellNotes,
} from "../../../utils/dice";
import type { DamageRollResult, HitRollResult } from "../../ui/RollOverlay";
import { ActionButton } from "../ActionButton";

// ── Context menu sub-components ────────────────────────────────────────────

interface ContextMenuPortalProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

function ContextMenuPortal({ x, y, onClose, children }: ContextMenuPortalProps) {
  // Clamp to viewport so it never renders off-screen
  const clampedX = Math.min(x, window.innerWidth - 200);
  const clampedY = Math.min(y, window.innerHeight - 160);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div
        className="fixed z-50 rounded-xl overflow-hidden"
        style={{
          top: clampedY,
          left: clampedX,
          background: "rgba(15, 17, 23, 0.97)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          minWidth: 180,
        }}
        role="menu"
      >
        {children}
      </div>
    </>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────

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

// ── Main SpellRow component ────────────────────────────────────────────────

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
  const [hitContextMenu, setHitContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [damageContextMenu, setDamageContextMenu] = useState<{ x: number; y: number } | null>(null);

  const levelNum = variant.levelNum;
  const hitDC = spellHitDC(spell, stats);
  const effect = spellEffect(spell, stats, levelNum);
  const notes = spellNotes(spell);
  const hasAttack = spell.spellType.kind === "attack";
  const hasDamage = spell.outputType.kind !== "utility" && effect !== "—" && effect !== "";
  const rowSpell: Spell = parseSpellLevel(spell, levelNum);

  function fireHitRoll(mode: RollMode) {
    onRollHit(buildHitRoll(spell, stats, nextRollId(), mode));
    setHitContextMenu(null);
  }

  function fireDamageRoll(isCrit: boolean) {
    onRollDamage(buildDamageRoll(spell, stats, levelNum, nextRollId(), isCrit));
    setDamageContextMenu(null);
  }

  return (
    <>
      <div
        className="flex justify-between items-center py-1 text-sm"
        style={{
          borderBottom: isLast ? "none" : "1px dotted var(--border)",
          background: "transparent",
        }}
        role="row"
      >
        {/* Action button (Cast or Arc) */}
        <ActionButton spell={spell} variant={variant} />

        {/* Name */}
        <div className="flex justify-start items-center h-[35px] min-w-[290px] p-1">
          <button
            className="cursor-pointer hover:underline min-w-0 font-medium truncate text-left"
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
        <div className="text-xs flex justify-center items-center h-[35px] min-w-[70px] p-1 text-[var(--text-secondary)]">
          {fmtCastTime(spell)}
        </div>

        {/* Range */}
        <div className="text-xs flex justify-center items-center h-[35px] min-w-[70px] p-1 text-[var(--text-secondary)]">
          {spell.range === "Self" || spell.range === "Touch" ? (
            spell.range
          ) : (
            <span>{spell.range?.replace(" feet", "").replace(" foot", "")} ft.</span>
          )}
        </div>

        {/* Hit / DC */}
        <div className="flex justify-center items-center h-[35px] min-w-[90px] p-1 text-center text-xs">
          {hasAttack ? (
            <button
              onClick={() => fireHitRoll("normal")}
              onContextMenu={(e) => {
                e.preventDefault();
                setHitContextMenu({ x: e.clientX, y: e.clientY });
              }}
              className={`${variant.kind === "arcanum" ? "btn-arcanum" : "btn-primary"} w-[50px] h-full text-[16px] justify-center`}
              aria-label={`Roll to hit with ${spell.name} (right-click for advantage/disadvantage)`}
              title="Click to roll · Right-click for advantage/disadvantage"
            >
              {hitDC}
            </button>
          ) : (
            <span className="text-[14px] text-[var(--text-secondary)]">{hitDC}</span>
          )}
        </div>

        {/* Effect */}
        <div className="flex justify-center items-center h-[35px] min-w-[140px] p-1">
          {hasDamage ? (
            <button
              onClick={() => fireDamageRoll(false)}
              onContextMenu={(e) => {
                e.preventDefault();
                setDamageContextMenu({ x: e.clientX, y: e.clientY });
              }}
              className={`${variant.kind === "arcanum" ? "btn-arcanum" : "btn-primary"} w-[120px] h-full text-[14px] justify-center`}
              aria-label={`Roll damage for ${spell.name} (right-click for critical)`}
              title="Click to roll · Right-click for critical damage"
            >
              {effect}
            </button>
          ) : (
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {spell.outputType.kind === "utility"
                ? spell.spellType.kind === "save"
                  ? "Control"
                  : "Buff"
                : effect}
            </span>
          )}
        </div>

        {/* Notes */}
        <div className="flex justify-start items-center h-[35px] min-w-[140px] p-1">
          <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {notes}
          </span>
        </div>
      </div>

      {/* Hit roll context menu — viewport-clamped */}
      {hitContextMenu && (
        <ContextMenuPortal
          x={hitContextMenu.x}
          y={hitContextMenu.y}
          onClose={() => setHitContextMenu(null)}
        >
          <div
            className="px-3 py-2 text-[13px] uppercase tracking-widest font-display"
            style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            Roll to Hit
          </div>
          {[
            { mode: "normal" as RollMode, label: "Normal Roll", color: "var(--text-primary)" },
            { mode: "advantage" as RollMode, label: "Advantage", color: "#34d399" },
            { mode: "disadvantage" as RollMode, label: "Disadvantage", color: "#f87171" },
          ].map(({ mode, label, color }) => (
            <button
              key={mode}
              onClick={() => fireHitRoll(mode)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left"
              style={{ color, background: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              role="menuitem"
            >
              {label}
            </button>
          ))}
        </ContextMenuPortal>
      )}

      {/* Damage context menu — viewport-clamped */}
      {damageContextMenu && (
        <ContextMenuPortal
          x={damageContextMenu.x}
          y={damageContextMenu.y}
          onClose={() => setDamageContextMenu(null)}
        >
          <div
            className="px-3 py-2 text-[13px] uppercase tracking-widest font-display"
            style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            Roll Damage
          </div>
          {[
            { isCrit: false, label: "Normal Roll", color: "var(--text-primary)" },
            { isCrit: true, label: "Critical Hit", color: "var(--crit-color, #ffd000)" },
          ].map(({ isCrit, label, color }) => (
            <button
              key={String(isCrit)}
              onClick={() => fireDamageRoll(isCrit)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left"
              style={{ color, background: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              role="menuitem"
            >
              {label}
            </button>
          ))}
        </ContextMenuPortal>
      )}
    </>
  );
}
