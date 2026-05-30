import { useState, useMemo } from "react";
import { SpellDetailModal } from "./SpellDetailModal";
import type { Character, ComputedStats, Spell, SpellLevel } from "../../types";
import { useSpells } from "../../hooks/spells/useSpells";
import SpellToolbar from "./SpellToolbar";
import { levelLabel } from "../../utils/dice";
import { StarFilledIcon, StarEmptyIcon } from "../ui/Icons";

interface SpellPreparerTabProps {
  character: Character;
  stats: ComputedStats;
  onUpdatePrepared: (prepared: number[]) => void;
}

// ── Compact spell row ─────────────────────────────────────────────────────────

interface SpellRowProps {
  spell: Spell;
  isPrepared: boolean;
  onToggle: (id: number) => void;
  onViewDetail: (spell: Spell) => void;
}

function schoolColor(school: string): string {
  const map: Record<string, string> = {
    illusion: "rgba(168,85,247)",
    evocation: "rgba(255,80,80)",
    conjuration: "rgba(14,165,233)",
    abjuration: "rgba(97,102,241)",
    divination: "rgba(234,179,8)",
    enchantment: "rgba(217,70,239)",
    necromancy: "rgba(16,185,129)",
    transmutation: "rgba(249,115,22)",
  };
  return map[school?.toLowerCase()] ?? "rgba(36,237,251,0.9)";
}

function CompactSpellRow({ spell, isPrepared, onToggle, onViewDetail }: SpellRowProps) {
  const color = schoolColor(spell.school);

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 border-b transition-colors cursor-pointer group"
      style={{ borderColor: "var(--border)" }}
      onClick={() => onViewDetail(spell)}
    >
      {/* School color strip */}
      <div className="w-0.5 h-6 rounded-full shrink-0" style={{ background: color }} />

      {/* Name + tags */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {spell.name}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {levelLabel(spell.level)} · {spell.school}
          {spell.concentration ? " · C" : ""}
          {spell.ritual ? " · R" : ""}
        </div>
      </div>

      {/* Prepare toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(spell.id);
        }}
        className={`shrink-0 w-7 h-7 flex items-center justify-center rounded transition-all ${
          isPrepared
            ? "text-amber-400 hover:text-amber-300"
            : "text-muted hover:text-amber-400 opacity-0 group-hover:opacity-100"
        }`}
        aria-label={isPrepared ? `Unprepare ${spell.name}` : `Prepare ${spell.name}`}
      >
        {isPrepared ? <StarFilledIcon size={14} /> : <StarEmptyIcon size={14} />}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SpellPreparerTab({ character, stats, onUpdatePrepared }: SpellPreparerTabProps) {
  const { data: spells = [], isLoading } = useSpells();

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<SpellLevel | "">("");
  const [filterSchool, setFilterSchool] = useState("");
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  const preparedSet = useMemo(() => new Set(character.prepared), [character.prepared]);

  function togglePrepare(spellId: number) {
    const next = preparedSet.has(spellId)
      ? character.prepared.filter((id) => id !== spellId)
      : [...character.prepared, spellId];
    onUpdatePrepared(next);
  }

  // Left: prepared spells — no filter applied, always show all prepared
  const preparedSpells = useMemo(
    () => spells.filter((s) => preparedSet.has(s.id)),
    [spells, preparedSet],
  );

  // Right: unprepared spells — filters applied, prepared ones excluded
  const unpreparedFiltered = useMemo(
    () =>
      spells.filter((spell) => {
        if (preparedSet.has(spell.id)) return false;
        if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterLevel && spell.level !== filterLevel) return false;
        if (filterSchool && spell.school !== filterSchool) return false;
        return true;
      }),
    [spells, preparedSet, search, filterLevel, filterSchool],
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar — filters apply to the right column only */}
      <SpellToolbar
        search={search}
        setSearch={setSearch}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        filterSchool={filterSchool}
        setFilterSchool={setFilterSchool}
      />

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Prepared spells ── */}
        <div
          className="flex flex-col border-r overflow-hidden"
          style={{ borderColor: "var(--border)", width: "50%" }}
        >
          <div
            className="px-3 py-2 text-xs font-display uppercase tracking-widest shrink-0"
            style={{
              color: "var(--text-muted)",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            Prepared
            {preparedSpells.length > 0 && (
              <span className="ml-2 text-accent">{preparedSpells.length}</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <PreparedSkeleton />
            ) : preparedSpells.length === 0 ? (
              <div className="flex items-center justify-center h-full p-6 text-center">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  No spells prepared. Click a spell on the right to prepare it.
                </p>
              </div>
            ) : (
              preparedSpells.map((spell) => (
                <CompactSpellRow
                  key={spell.id}
                  spell={spell}
                  isPrepared
                  onToggle={togglePrepare}
                  onViewDetail={setDetailSpell}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Right: Unprepared spells ── */}
        <div className="flex flex-col overflow-hidden" style={{ width: "50%" }}>
          <div
            className="px-3 py-2 text-xs font-display uppercase tracking-widest shrink-0"
            style={{
              color: "var(--text-muted)",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            Available
            {unpreparedFiltered.length > 0 && (
              <span className="ml-2" style={{ color: "var(--text-muted)" }}>
                {unpreparedFiltered.length}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <AvailableSkeleton />
            ) : unpreparedFiltered.length === 0 ? (
              <div className="flex items-center justify-center h-full p-6 text-center">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {spells.length === 0
                    ? "Add spells in the Spell Manager first."
                    : preparedSet.size === spells.length
                      ? "All spells are prepared."
                      : "No spells match your filters."}
                </p>
              </div>
            ) : (
              unpreparedFiltered.map((spell) => (
                <CompactSpellRow
                  key={spell.id}
                  spell={spell}
                  isPrepared={false}
                  onToggle={togglePrepare}
                  onViewDetail={setDetailSpell}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <SpellDetailModal
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
        spell={detailSpell}
        stats={stats}
        prepared={character.prepared}
        onTogglePrepare={togglePrepare}
        isPreparer={true}
      />
    </div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function PreparedSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 border-b animate-shimmer"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="w-0.5 h-6 rounded-full bg-[var(--border)]" />
          <div className="flex-1 space-y-1">
            <div className="h-3 rounded bg-[var(--border)] w-3/4" />
            <div className="h-2 rounded bg-[var(--border)] w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}

function AvailableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 border-b animate-shimmer"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="w-0.5 h-6 rounded-full bg-[var(--border)]" />
          <div className="flex-1 space-y-1">
            <div className="h-3 rounded bg-[var(--border)] w-2/3" />
            <div className="h-2 rounded bg-[var(--border)] w-1/3" />
          </div>
        </div>
      ))}
    </>
  );
}
