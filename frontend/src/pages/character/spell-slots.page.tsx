import { useEffect, useState } from "react";
import { SlotSettingsModal } from "../../components/slots/modals/SlotSettingsModal";
import { TemplateModal } from "../../components/slots/modals/TemplateModal";
import { PactSettingsModal } from "../../components/slots/pact/PactSettingsModal";
import { SlotColumnHeaders } from "../../components/slots/rows/SlotColumnHeader";
import { SpellRow } from "../../components/slots/rows/SpellRow";
import { SpellDetailModal } from "../../components/spells/modals/SpellDetailModal";
import {
  MoonRestIcon,
  PactIcon,
  PlusIcon,
  SunRestIcon,
  TemplateIcon,
} from "../../components/ui/Icons";
import type { DamageRollResult, HitRollResult } from "../../components/ui/RollOverlay";
import { usePreparedSpells } from "../../hooks/spells/usePreparedSpells";
import { useSpells } from "../../hooks/spells/useSpells";
import { useSpellTemplate } from "../../hooks/spells/useSpellTemplate";
import type {
  Character,
  ComputedStats,
  LevelRow,
  PactMagic,
  Spell,
  TemplateResult,
} from "../../types";
import { PageShell } from "../../components/shells/page-shell.component";

interface SpellSlotsPageProps {
  character: Character;
  stats: ComputedStats;
  onUpdateCharacter: (patch: Partial<Character>) => void;
  onRollHit: (result: HitRollResult) => void;
  onRollDamage: (result: DamageRollResult) => void;
  nextRollId: () => number;
}

export function SpellSlotsPage({
  character,
  stats,
  onUpdateCharacter,
  onRollHit,
  onRollDamage,
  nextRollId,
}: SpellSlotsPageProps) {
  const { data: spells = [] } = useSpells();
  const templateMut = useSpellTemplate();

  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);
  const [slotSettingsOpen, setSlotSettingsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [pactOpen, setPactOpen] = useState(false);
  const [castingSpellId, setCastingSpellId] = useState<string | null>(null);

  // Close cast popover on click-outside
  useEffect(() => {
    if (castingSpellId === null) return;
    function handleClick() {
      setCastingSpellId(null);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [castingSpellId]);

  // ── Level rows ─────────────────────────────────────────────────────────────

  function toggleSlot(rowId: string, slotIndex: number) {
    const levels = character.levels.map((row) => {
      if (row.id !== rowId) return row;
      const nowUsed = slotIndex < row.used ? slotIndex : row.used + 1;
      return { ...row, used: Math.min(Math.max(nowUsed, 0), row.total) };
    });
    onUpdateCharacter({ levels });
  }

  // ── Template ───────────────────────────────────────────────────────────────

  async function applyTemplate(casterType: "full" | "half" | "warlock") {
    const charLevel = character.globals?.charLevel ?? 1;
    const result: TemplateResult = await templateMut.mutateAsync({ casterType, charLevel });
    const patch: Partial<Character> = { levels: result.levels };
    if (result.pact) patch.pact = result.pact;
    onUpdateCharacter(patch);
    setTemplateOpen(false);
  }

  // ── Pact ───────────────────────────────────────────────────────────────────

  function togglePactSlot(i: number) {
    const pact = { ...character.pact };
    pact.used = i < pact.used ? i : pact.used + 1;
    pact.used = Math.min(Math.max(pact.used, 0), pact.slots);
    onUpdateCharacter({ pact });
  }

  function toggleArcanum(idx: number) {
    const arcana = character.pact.arcana.map((a, i) => (i === idx ? { ...a, used: !a.used } : a));
    onUpdateCharacter({ pact: { ...character.pact, arcana } });
  }

  // ── Prepared spells ────────────────────────────────────────────────────────

  const { preparedSet } = usePreparedSpells(spells, character, () => onUpdateCharacter);

  function getPreparedSpells(row: LevelRow) {
    const rowLevel = parseInt(row.label.replace(/\D/g, ""), 10) || 0;
    return spells.filter((s) => {
      if (!preparedSet.has(s.id)) return false;
      if (s.level === "cantrip") return rowLevel === 0;
      const spellLevel = parseInt(s.level, 10) || 0;
      return rowLevel > 0 && spellLevel <= rowLevel;
    });
  }

  // ── Cast ───────────────────────────────────────────────────────────────────

  function castFromRow(spell: Spell, row: LevelRow) {
    if (spell.level === "cantrip") return;
    onUpdateCharacter({
      levels: character.levels.map((r) =>
        r.id === row.id ? { ...r, used: Math.min(r.used + 1, r.total) } : r,
      ),
    });
    setCastingSpellId(null);
  }

  function castFromPact(spell: Spell) {
    if (spell.level === "cantrip") return;
    const pact = character.pact;
    onUpdateCharacter({ pact: { ...pact, used: Math.min(pact.used + 1, pact.slots) } });
    setCastingSpellId(null);
  }

  // ── Rests ──────────────────────────────────────────────────────────────────

  function doShortRest() {
    onUpdateCharacter({ pact: { ...character.pact, used: 0 } });
  }

  function doLongRest() {
    const levels = character.levels.map((r) => ({ ...r, used: 0 }));
    const pact = {
      ...character.pact,
      used: 0,
      arcana: (character.pact.arcana ?? []).map((a) => ({ ...a, used: false })),
    };
    onUpdateCharacter({ levels, pact });
  }

  const pact = character.pact;
  const showPact = pact?.enabled && pact.slots > 0;
  const isEmpty = character.levels.length === 0 && !showPact;

  return (
    <PageShell>
      {/* ── Toolbar ── */}
      <div
        className="flex items-center gap-2 px-15 pt-5 pb-3 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <button
          className="btn-ghost text-xs px-3 py-1.5 shrink-0 flex items-center gap-1.5"
          onClick={() => setSlotSettingsOpen(true)}
          aria-label="Edit spell slot levels"
        >
          <PlusIcon size={12} />
          Edit Slots
        </button>
        <button
          className="btn-ghost text-xs px-3 py-1.5 shrink-0 flex items-center gap-1.5"
          onClick={() => setTemplateOpen(true)}
          aria-label="Load a caster template"
        >
          <TemplateIcon size={12} />
          Load Template
        </button>
        <button
          className="btn-ghost text-xs px-3 py-1.5 shrink-0 flex items-center gap-1.5"
          onClick={() => setPactOpen(true)}
          aria-label="Configure Pact Magic"
        >
          <PactIcon size={12} />
          Pact Magic
        </button>
        <div className="flex-1" />
        <button
          className="btn-ghost text-xs px-3 py-1.5 shrink-0 flex items-center gap-1.5"
          onClick={doShortRest}
          aria-label="Take a short rest (restores pact slots)"
        >
          <MoonRestIcon size={12} />
          Short Rest
        </button>
        <button
          className="btn-primary text-xs px-3 py-1.5 shrink-0 flex items-center gap-1.5"
          onClick={doLongRest}
          aria-label="Take a long rest (restores all slots)"
        >
          <SunRestIcon size={12} />
          Long Rest
        </button>
      </div>

      {/* ── Content ── */}
      <div className="flex-1">
        {/* Empty state — improved with CTAs */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-8 py-16 text-center">
            <div style={{ opacity: 0.15 }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <circle cx="32" cy="32" r="10" stroke="var(--accent)" strokeWidth="2" />
                <circle cx="32" cy="32" r="3" fill="var(--accent)" />
              </svg>
            </div>
            <div>
              <p className="font-display text-sm tracking-widest text-accent uppercase mb-1">
                No Spell Slots Yet
              </p>
              <p className="text-xs text-muted max-w-xs">
                Add individual levels with <strong className="text-dim">Edit Slots</strong>, or
                quickly load a full caster layout with{" "}
                <strong className="text-dim">Load Template</strong>.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="btn-primary text-xs px-4 py-2"
                onClick={() => setSlotSettingsOpen(true)}
              >
                Edit Slots
              </button>
              <button className="btn-ghost text-xs px-4 py-2" onClick={() => setTemplateOpen(true)}>
                Load Template
              </button>
            </div>
          </div>
        )}

        {/* ── Level sections ── */}
        {!isEmpty &&
          (() => {
            const levelNums = new Set<number>(
              character.levels.map((r) => parseInt(r.label.replace(/\D/g, ""), 10) || 0),
            );
            if (showPact) levelNums.add(pact.slotLevel);
            (pact?.arcana ?? []).forEach((a) => levelNums.add(a.level));
            const allLevels = Array.from(levelNums).sort((a, b) => a - b);

            return allLevels.map((levelNum) => {
              const row =
                character.levels.find(
                  (r) => (parseInt(r.label.replace(/\D/g, ""), 10) || 0) === levelNum,
                ) ?? null;
              const isPactLevel = showPact && pact.slotLevel === levelNum;
              const isCantrip = levelNum === 0;
              const isHigh = levelNum >= 10;
              const slotsLeft = row ? row.total - row.used : 0;
              const pactSlotsLeft = isPactLevel ? pact.slots - pact.used : 0;

              const syntheticRow: LevelRow = row ?? {
                id: `pact_level_${levelNum}`,
                label: `Level ${levelNum}`,
                total: 0,
                used: 0,
              };

              const hasSlots = row !== null || pactSlotsLeft > 0;
              const preparedHere =
                pact.slotLevel === levelNum || hasSlots ? getPreparedSpells(syntheticRow) : [];
              const arcanumHere = pact?.arcana?.filter((a) => a.level === levelNum) ?? [];
              const canCast = isCantrip || slotsLeft > 0 || pactSlotsLeft > 0;

              return (
                <div key={`level-${levelNum}`} className="my-10 max-w-[1000px] m-auto">
                  {/* Section heading */}
                  <div className="flex items-center gap-4 px-4 py-2.5 border-b-[1px] border-b-[var(--border)]">
                    <span className="font-display text-base tracking-widest uppercase text-[var(--accent)]">
                      {isCantrip ? "Cantrip" : `Level ${levelNum}`}
                    </span>
                    <div className="flex-1" />

                    {!isCantrip && (
                      <div className="flex items-center gap-4">
                        {/* PACT slots */}
                        {isPactLevel && (
                          <div className="flex items-center gap-2">
                            <div
                              className="flex gap-1.5"
                              role="group"
                              aria-label={`Pact slots: ${pact.slots - pact.used} of ${pact.slots} remaining`}
                            >
                              {Array.from({ length: pact.slots }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => togglePactSlot(i)}
                                  aria-label={
                                    i < pact.used
                                      ? `Pact slot ${i + 1} expended — click to restore`
                                      : `Pact slot ${i + 1} available — click to expend`
                                  }
                                  aria-pressed={i >= pact.used}
                                  className="transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 3,
                                    border: "2px solid var(--pact-full)",
                                    background: i < pact.used ? "transparent" : "var(--pact-full)",
                                    opacity: i < pact.used ? 0.35 : 1,
                                    cursor: "pointer",
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-[var(--text-primary)]">PACT</span>
                          </div>
                        )}

                        {/* SLOTS */}
                        {row && (
                          <div className="flex items-center gap-2">
                            <div
                              className="flex gap-1.5"
                              role="group"
                              aria-label={`Spell slots level ${levelNum}: ${row.total - row.used} of ${row.total} remaining`}
                            >
                              {Array.from({ length: row.total }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => toggleSlot(row.id, i)}
                                  aria-label={
                                    i < row.used
                                      ? `Slot ${i + 1} expended — click to restore`
                                      : `Slot ${i + 1} available — click to expend`
                                  }
                                  aria-pressed={i >= row.used}
                                  className="transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                  style={{
                                    width: 18,
                                    height: 18,
                                    border: `2px solid ${isHigh ? "#fbbf24" : "var(--accent)"}`,
                                    borderRadius: 3,
                                    background:
                                      i < row.used
                                        ? "transparent"
                                        : isHigh
                                          ? "#fbbf24"
                                          : "var(--accent)",
                                    opacity: i < row.used ? 0.35 : 1,
                                    cursor: "pointer",
                                  }}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-[var(--text-primary)]">SLOTS</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Column headers */}
                  {preparedHere.length > 0 && <SlotColumnHeaders />}

                  {/* Spell rows — using shared SpellRow component */}
                  {preparedHere.map((spell, si) => (
                    <SpellRow
                      key={spell.id}
                      spell={spell}
                      stats={stats}
                      isLast={si === preparedHere.length - 1 && arcanumHere.length === 0}
                      variant={{
                        kind: "cast",
                        row,
                        isPactLevel,
                        pactSlotsLeft,
                        slotsLeft,
                        isCantrip,
                        canCast,
                        castingSpellId,
                        levelNum,
                        onCastFromRow: castFromRow,
                        onCastFromPact: castFromPact,
                        setCastingSpellId,
                      }}
                      onViewDetail={setDetailSpell}
                      onRollHit={onRollHit}
                      onRollDamage={onRollDamage}
                      nextRollId={nextRollId}
                    />
                  ))}

                  {preparedHere.length === 0 &&
                    arcanumHere.filter((a) => a.spellId).length === 0 && (
                      <div className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        No prepared {isCantrip ? "cantrips" : "spells or mystic arcanum"} at this
                        level.
                      </div>
                    )}

                  {/* Arcanum rows — reuse SpellRow with arcanum variant */}
                  {arcanumHere.map((arc) => {
                    const globalIdx = pact.arcana.indexOf(arc);
                    const arcSpell = arc.spellId ? spells.find((s) => s.id === arc.spellId) : null;
                    if (!arcSpell) return null;

                    return (
                      <div key={`arc-${arc.level}-${arc.spellId}`}>
                        {preparedHere.length === 0 && <SlotColumnHeaders />}
                        <SpellRow
                          spell={arcSpell}
                          stats={stats}
                          isLast={true}
                          variant={{
                            kind: "arcanum",
                            arcUsed: arc.used,
                            levelNum,
                            onCastArcanum: () => !arc.used && toggleArcanum(globalIdx),
                          }}
                          onViewDetail={setDetailSpell}
                          onRollHit={onRollHit}
                          onRollDamage={onRollDamage}
                          nextRollId={nextRollId}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
      </div>

      {/* ── Modals ── */}
      <SlotSettingsModal
        open={slotSettingsOpen}
        onClose={() => setSlotSettingsOpen(false)}
        levels={character.levels}
        highMagic={character.globals?.highMagic ?? false}
        onUpdate={(levels) => onUpdateCharacter({ levels })}
      />

      <TemplateModal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        charLevel={character.globals?.charLevel ?? 1}
        onApply={applyTemplate}
        isPending={templateMut.isPending}
      />

      <PactSettingsModal
        open={pactOpen}
        onClose={() => setPactOpen(false)}
        pact={character.pact}
        spells={spells}
        onUpdate={(pact: PactMagic) => onUpdateCharacter({ pact })}
      />

      <SpellDetailModal
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
        spell={detailSpell}
        stats={stats}
        prepared={character.prepared}
        onTogglePrepare={(id: number) => {
          const next = character.prepared.includes(id)
            ? character.prepared.filter((p) => p !== id)
            : [...character.prepared, id];
          onUpdateCharacter({ prepared: next });
        }}
      />
    </PageShell>
  );
}
