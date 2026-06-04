import { Modal } from "../../ui/Modal";
import {
  ConcentrationBadge,
  RitualBadge,
  SchoolBadge,
} from "../../ui/SchoolBadge";
import type { Spell, ComputedStats } from "../../../types";
import { levelLabel } from "../../../utils/dice";
import { buildGrid } from "../../../utils/stats";

interface SpellDetailModalProps {
  open: boolean;
  onClose: () => void;
  spell: Spell | null;
  stats?: ComputedStats;
  prepared?: number[];
  onTogglePrepare?: (spellId: number) => void;
  isPreparer?: boolean;
  slot?: number;
}

export function SpellDetailModal({
  open,
  onClose,
  spell,
  stats,
  prepared,
  onTogglePrepare,
  isPreparer,
}: SpellDetailModalProps) {
  if (!spell) return null;

  const preparePage = isPreparer ?? false;
  const isPrepared = prepared ? prepared.includes(spell.id) : false;
  const spellStats: ComputedStats = stats
    ? stats
    : {
        spellSaveDC: 10,
        attackBonus: 5,
        cantripTier: 1,
        charLevel: 1,
        spellMod: 5,
      };

  const spellGrid = buildGrid(spell, spellStats, preparePage);

  return (
    <Modal open={open} onClose={onClose} title={spell.name} width="max-w-2xl">
      <div className="space-y-4">
        {/* School + Level + flags */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-dim text-sm">{levelLabel(spell.level)}</span>
          <SchoolBadge school={spell.school} />
          {spell.concentration && <ConcentrationBadge />}
          {spell.ritual && <RitualBadge />}
        </div>
        {/* Stats grid */}
        <div className="flex flex-wrap gap-2" role="list">
          {spellGrid.map(({ label, value }) => (
            <div
              key={label}
              className="flex-1 rounded p-2"
              style={{
                flexBasis: "200px",
                background: "var(--bg-ternary)",
              }}
            >
              <div className="label">{label}</div>
              <div style={{ color: "var(--text-primary)" }}>{value || "—"}</div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {spell.notes && (
          <div
            className="rounded p-2"
            style={{ background: "var(--bg-ternary)" }}
          >
            <div className="label">Desc</div>
            <div style={{ color: "var(--text-primary)" }}>
              <div
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-secondary)",
                  borderRadius: "5px",
                  whiteSpace: "pre-wrap",
                }}
                dangerouslySetInnerHTML={{
                  __html: spell.notes.replace(
                    /\*\*(.+?)\*\*/g,
                    `<span class="bold-text">$1</span>`,
                  ),
                }}
              />
            </div>
          </div>
        )}

        {/* Prepare toggle */}
        {preparePage && (
          <button
            className={
              isPrepared
                ? "btn-ghost w-full justify-center border-amber-800 text-amber-400"
                : "btn-ghost w-full justify-center"
            }
            onClick={() =>
              onTogglePrepare ? onTogglePrepare(spell.id) : undefined
            }
          >
            {isPrepared ? "★ Prepared" : "☆ Prepare Spell"}
          </button>
        )}
      </div>
    </Modal>
  );
}
