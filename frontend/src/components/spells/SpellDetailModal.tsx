import { Modal } from "../ui/Modal";
import { ConcentrationBadge, RitualBadge, SchoolBadge } from "../ui/SchoolBadge";
import type { Spell, ComputedStats } from "../../types";
import { levelLabel, fmtBonus, formatComponents, cantripDiceCount } from "../../utils/dice";

interface SpellDetailModalProps {
  open: boolean;
  onClose: () => void;
  spell: Spell | null;
  stats?: ComputedStats;
  prepared?: number[];
  onTogglePrepare?: (spellId: number) => void;
  isPreparer?: boolean;
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
  const isCantrip = spell.level === "cantrip";
  const st = spell.spellType;
  const out = spell.outputType;
  const spellStats: ComputedStats = stats
    ? stats
    : {
        spellSaveDC: 10,
        attackBonus: 5,
        cantripTier: 1,
        charLevel: 1,
        spellMod: 5,
      };

  return (
    <Modal open={open} onClose={onClose} title={spell.name} width="max-w-lg">
      <div className="space-y-4">
        {/* School + Level + flags */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-dim">{levelLabel(spell.level)}</span>
          <SchoolBadge school={spell.school} />
          {spell.concentration && <ConcentrationBadge />}
          {spell.ritual && <RitualBadge />}
        </div>
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: "Casting Time", value: spell.castTime },
            { label: "Range", value: spell.range },
            { label: "Duration", value: spell.duration },
            { label: "Components", value: formatComponents(spell.components) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded p-2" style={{ background: "var(--bg-ternary)" }}>
              <div className="label">{label}</div>
              <div style={{ color: "var(--text-primary)" }}>{value || "—"}</div>
            </div>
          ))}
        </div>

        {/* Attack / save info */}
        {st.kind !== "utility" && (
          <div
            className="rounded p-3 border"
            style={{ borderColor: "var(--border)", background: "var(--bg-ternary)" }}
          >
            {st.kind === "save" && (
              <div className="flex items-center gap-4">
                <div>
                  <div className="label">Save DC</div>
                  <div className="text-2xl font-display text-accent">{spellStats.spellSaveDC}</div>
                </div>
                <div>
                  <div className="label">Ability</div>
                  <div className="text-sm">{st.saveAbility}</div>
                </div>
              </div>
            )}
            {st.kind === "attack" && (
              <div className="flex items-center gap-4">
                <div>
                  <div className="label">Attack Bonus</div>
                  <div className="text-2xl font-display text-accent">
                    {fmtBonus(spellStats.attackBonus)}
                  </div>
                </div>
                <div>
                  <div className="label">Type</div>
                  <div className="text-sm">{st.attackType}</div>
                </div>
                {st.critRange && st.critRange < 20 && (
                  <div>
                    <div className="label">Crit Range</div>
                    <div className="text-sm">{st.critRange}–20</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Damage / output */}
        {out.kind === "leveled" && out.dice.length > 0 && (
          <div>
            <div className="label mb-1">Damage</div>
            <div className="flex flex-wrap gap-1">
              {out.dice.map((d, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-sm font-mono"
                  style={{ background: "var(--bg-ternary)", color: "var(--text-secondary)" }}
                >
                  {d.count > 0 ? `${d.count}${d.die}` : ""}
                  {d.flatBonus ? ` + ${d.flatBonus}` : ""}
                  {d.addCastingMod ? ` + mod` : ""} {d.type}
                </span>
              ))}
            </div>
            {out.upcast?.dice && out.upcast.dice.length > 0 && (
              <div className="mt-1 text-xs text-dim">
                Upcast:{" "}
                {out.upcast.dice.map((u, i) => (
                  <span key={i}>
                    +{u.count}
                    {u.die} {u.type} per {u.everyNLevels} level(s) above {u.aboveLevel}
                  </span>
                ))}
              </div>
            )}
            {out.projectiles && (
              <div className="mt-1 text-xs text-dim">
                {out.projectiles.baseCount} projectile(s)
                {out.projectiles.upcast &&
                  ` +${out.projectiles.upcast.count} per ${out.projectiles.upcast.everyNLevels} level(s) above ${out.projectiles.upcast.aboveLevel}`}
              </div>
            )}
          </div>
        )}

        {/* Cantrips */}
        {out.kind === "cantrip" && out.dice !== undefined && (
          <div>
            <div className="label mb-1">
              Damage (Cantrip — Tier {cantripDiceCount(spell, spellStats.cantripTier)})
            </div>
            <div className="flex flex-wrap gap-1">
              {out.dice.map((d, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-sm font-mono"
                  style={{ background: "var(--bg-ternary)", color: "var(--text-secondary)" }}
                >
                  {cantripDiceCount(spell, spellStats.cantripTier)}
                  {d.die}
                  {d.addCastingMod ? ` + mod` : ""} {d.type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {spell.notes && (
          <div className="rounded p-2" style={{ background: "var(--bg-ternary)" }}>
            <div className="label">Desc</div>
            <div style={{ color: "var(--text-primary)" }}>
              <div
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--text-secondary)",
                  borderRadius: "5px",
                }}
              >
                {spell.notes}
              </div>
            </div>
          </div>
        )}

        {/* Prepare toggle */}
        {preparePage && !isCantrip && (
          <button
            className={
              isPrepared
                ? "btn-ghost w-full justify-center text-amber-400 border-amber-800"
                : "btn-ghost w-full justify-center"
            }
            onClick={() => (onTogglePrepare ? onTogglePrepare(spell.id) : undefined)}
          >
            {isPrepared ? "★ Prepared" : "☆ Prepare Spell"}
          </button>
        )}
      </div>
    </Modal>
  );
}
