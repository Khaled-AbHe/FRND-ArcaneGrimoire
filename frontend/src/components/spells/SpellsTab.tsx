import { useState, useMemo } from "react";
import { SpellFormModal } from "./SpellFormModal";
import { SpellDetailModal } from "./SpellDetailModal";
import type { Spell, Character, ComputedStats, SpellLevel } from "../../types";
import { useSpells } from "../../hooks/spells/useSpells";
import { levelLabel } from "../../utils/dice";
import { SCHOOLS, SPELL_LEVELS } from "../../types";
import SpellCard from "./SpellCard";
import { PlusIcon } from "../ui/Icons";

interface SpellsTabProps {
  character: Character;
  stats: ComputedStats | {
    spellSaveDC: number;
    charLevel: number;
    attackBonus: number;
    cantripTier: number;
    spellMod: number;
  };
  onUpdatePrepared: (prepared: number[]) => void;
  onUpdateCharacter: (patch: Partial<Character>) => void;
}

export function SpellsTab({ character, stats, onUpdatePrepared }: SpellsTabProps) {
  const { data: spells = [], isLoading } = useSpells();

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<SpellLevel | "">("");
  const [filterSchool, setFilterSchool] = useState("");
  const [showUnprepared, setShowUnprepared] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editSpell, setEditSpell] = useState<Spell | null>(null);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  const preparedSet = useMemo(() => new Set(character.prepared), [character.prepared]);

  const filtered = spells.filter((spell) => {
    if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterLevel && spell.level !== filterLevel) return false;
    if (filterSchool && spell.school !== filterSchool) return false;
    if (!showUnprepared && !preparedSet.has(spell.id)) return false;
    return true;
  });

  function togglePrepare(spellId: number) {
    const next = preparedSet.has(spellId)
      ? character.prepared.filter((id) => id !== spellId)
      : [...character.prepared, spellId];
    onUpdatePrepared(next);
  }

  const hasFilters = search || filterLevel || filterSchool || !showUnprepared;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 border-b space-y-2" style={{ borderColor: "var(--border)" }}>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Search spells…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search spells by name"
          />
          <button
            className="btn-primary text-sm px-3 flex items-center gap-1.5 shrink-0"
            aria-label="Add new spell"
            onClick={() => {
              setEditSpell(null);
              setFormOpen(true);
            }}
          >
            <PlusIcon size={12} />
            Add Spell
          </button>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <select
            className="select text-xs py-1"
            style={{ width: "auto" }}
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as SpellLevel | "")}
            aria-label="Filter by spell level"
          >
            <option value="">All Levels</option>
            {SPELL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {levelLabel(l)}
              </option>
            ))}
          </select>
          <select
            className="select text-xs py-1"
            style={{ width: "auto" }}
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
            aria-label="Filter by magic school"
          >
            <option value="">All Schools</option>
            {SCHOOLS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <label
            className="flex items-center gap-1.5 text-xs cursor-pointer select-none"
            style={{ color: "var(--text-secondary)" }}
          >
            <input
              type="checkbox"
              checked={showUnprepared}
              onChange={(e) => setShowUnprepared(e.target.checked)}
              aria-label="Show unprepared spells"
            />
            Show unprepared
          </label>
        </div>
      </div>

      {/* Spell grid */}
      <div className="flex-1 overflow-y-auto p-4" role="main" aria-label="Spell list">
        {isLoading ? (
          /* Loading skeleton */
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            aria-busy="true"
            aria-label="Loading spells"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border animate-shimmer"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border)",
                  height: 130,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state — context-aware */
          <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
            {spells.length === 0 ? (
              <>
                <div style={{ opacity: 0.15 }}>
                  <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                    <rect x="12" y="8" width="36" height="48" rx="4" stroke="var(--accent)" strokeWidth="2" />
                    <path d="M20 22h24M20 30h20M20 38h16" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M40 46l6 6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-display text-sm tracking-widest text-accent uppercase mb-1">
                    Spellbook Empty
                  </p>
                  <p className="text-xs text-muted max-w-xs">
                    Your grimoire awaits. Add your first spell to begin.
                  </p>
                </div>
                <button
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                  onClick={() => { setEditSpell(null); setFormOpen(true); }}
                >
                  <PlusIcon size={12} />
                  Add First Spell
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted">No spells match your filters.</p>
                {hasFilters && (
                  <button
                    className="btn-ghost text-xs px-3 py-1.5"
                    onClick={() => {
                      setSearch("");
                      setFilterLevel("");
                      setFilterSchool("");
                      setShowUnprepared(true);
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
            role="list"
            aria-label={`${filtered.length} spell${filtered.length !== 1 ? "s" : ""}`}
          >
            {filtered.map((spell) => (
              <div key={spell.id} role="listitem">
                <SpellCard
                  spell={spell}
                  character={character}
                  stats={stats as ComputedStats}
                  onViewDetail={(spell) => setDetailSpell(spell)}
                  onEdit={(spell) => {
                    setEditSpell(spell);
                    setFormOpen(true);
                  }}
                  togglePrepare={togglePrepare}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <SpellFormModal open={formOpen} onClose={() => setFormOpen(false)} editing={editSpell} />
      <SpellDetailModal
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
        spell={detailSpell}
        stats={stats}
        prepared={character.prepared}
        onTogglePrepare={togglePrepare}
      />
    </div>
  );
}
