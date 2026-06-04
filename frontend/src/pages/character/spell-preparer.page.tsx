import { useState } from "react";
import { SpellToolbar } from "../../components/spells/SpellToolbar";
import { SpellDetailModal } from "../../components/spells/modals/SpellDetailModal";
import { StarEmptyIcon, StarFilledIcon } from "../../components/ui/Icons";
import { usePreparedSpells } from "../../hooks/spells/usePreparedSpells";
import { useSpellFilters } from "../../hooks/spells/useSpellFilters";
import { useSpells } from "../../hooks/spells/useSpells";
import type { Character, ComputedStats, Spell } from "../../types";
import { levelLabel, schoolColor } from "../../utils/dice";
import { PageShell } from "../../components/shells/page-shell.component";

interface SpellPreparerPageProps {
  character: Character;
  stats: ComputedStats;
  onUpdatePrepared: (prepared: number[]) => void;
}

// ── Compact spell row ─────────────────────────────────────────────────────────

interface CompactSpellRowProps {
  spell: Spell;
  isPrepared: boolean;
  onToggle: (id: number) => void;
  onViewDetail: (spell: Spell) => void;
}

function CompactSpellRow({
  spell,
  isPrepared,
  onToggle,
  onViewDetail,
}: CompactSpellRowProps) {
  const color = schoolColor(spell.school);
  return (
    <div
      className="group flex cursor-pointer items-center gap-3 border-b px-3 py-2.5 transition-colors"
      style={{ borderColor: "var(--border)" }}
      onClick={() => onViewDetail(spell)}
    >
      <div
        className="h-6 w-0.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {spell.name}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {levelLabel(spell.level)} · {spell.school}
          {spell.concentration ? " · C" : ""}
          {spell.ritual ? " · R" : ""}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(spell.id);
        }}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded transition-all ${
          isPrepared
            ? "text-amber-400 hover:text-amber-300"
            : "text-muted opacity-0 hover:text-amber-400 group-hover:opacity-100"
        }`}
        aria-label={
          isPrepared ? `Unprepare ${spell.name}` : `Prepare ${spell.name}`
        }
      >
        {isPrepared ? (
          <StarFilledIcon size={14} />
        ) : (
          <StarEmptyIcon size={14} />
        )}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SpellPreparerPage({
  character,
  stats,
  onUpdatePrepared,
}: SpellPreparerPageProps) {
  const { data: spells = [], isLoading } = useSpells();
  const { preparedSet, preparedSpells, unpreparedSpells, togglePrepare } =
    usePreparedSpells(spells, character, onUpdatePrepared);
  const filters = useSpellFilters(unpreparedSpells);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  return (
    <PageShell>
      <SpellToolbar
        search={filters.search}
        setSearch={filters.setSearch}
        filterLevel={filters.filterLevel}
        setFilterLevel={filters.setFilterLevel}
        filterSchool={filters.filterSchool}
        setFilterSchool={filters.setFilterSchool}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Prepared */}
        <div
          className="flex flex-col overflow-hidden border-r"
          style={{ borderColor: "var(--border)", width: "50%" }}
        >
          <ColumnHeader label="Prepared" count={preparedSpells.length} />
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <RowSkeleton count={3} />
            ) : preparedSpells.length === 0 ? (
              <EmptyMessage text="No spells prepared. Click a spell on the right to prepare it." />
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

        {/* Available */}
        <div className="flex flex-col overflow-hidden" style={{ width: "50%" }}>
          <ColumnHeader label="Available" count={filters.filtered.length} />
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <RowSkeleton count={6} />
            ) : filters.filtered.length === 0 ? (
              <EmptyMessage
                text={
                  spells.length === 0
                    ? "Add spells in the Spell Manager first."
                    : preparedSet.size === spells.length
                      ? "All spells are prepared."
                      : "No spells match your filters."
                }
              />
            ) : (
              filters.filtered.map((spell) => (
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
    </PageShell>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ColumnHeader({ label, count }: { label: string; count: number }) {
  return (
    <div
      className="shrink-0 px-3 py-2 font-display text-xs uppercase tracking-widest"
      style={{
        color: "var(--text-muted)",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {label}
      {count > 0 && (
        <span className="ml-2" style={{ color: "var(--accent)" }}>
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center">
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {text}
      </p>
    </div>
  );
}

function RowSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-shimmer flex items-center gap-3 border-b px-3 py-2.5"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="h-6 w-0.5 rounded-full bg-[var(--border)]" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-3/4 rounded bg-[var(--border)]" />
            <div className="h-2 w-1/2 rounded bg-[var(--border)]" />
          </div>
        </div>
      ))}
    </>
  );
}
