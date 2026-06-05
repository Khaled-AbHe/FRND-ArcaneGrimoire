import { SetStateAction } from "react";
import {
  Character,
  ComputedStats,
  LevelRow,
  PactMagic,
  Spell,
} from "../../types";
import { SlotColumnHeaders } from "../slots/rows/SlotColumnHeader";
import { SpellRow } from "../slots/rows/SpellRow";
import { SlotDisplay } from "../slots/SlotDisplay";
import { DamageRollResult, HitRollResult } from "../ui/RollOverlay";

interface LevelSectionProps {
  character: Character;
  showPact: boolean;
  pact: PactMagic;
  spells: Spell[];
  preparedSet: Set<number>;
  stats: ComputedStats;
  levelNum: number;
  onRollHit: (result: HitRollResult) => void;
  onRollDamage: (result: DamageRollResult) => void;
  nextRollId: () => number;
  setDetailSpell: React.Dispatch<React.SetStateAction<Spell | null>>;
  onUpdateCharacter: (patch: Partial<Character>) => void;
  setCastingSpellId: (value: SetStateAction<string | null>) => void;
  castingSpellId: string | null;
}

export function LevelSection({
  character,
  showPact,
  pact,
  spells,
  preparedSet,
  stats,
  levelNum,
  onRollHit,
  onRollDamage,
  nextRollId,
  setDetailSpell,
  onUpdateCharacter,
  setCastingSpellId,
  castingSpellId,
}: LevelSectionProps) {
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

  const rowEnabled = row !== null || pactSlotsLeft > 0;
  const preparedHere =
    pact.slotLevel === levelNum || rowEnabled
      ? getPreparedSpells(syntheticRow)
      : [];
  const arcanumHere = pact?.arcana?.filter((a) => a.level === levelNum) ?? [];
  const canCast = isCantrip || slotsLeft > 0 || pactSlotsLeft > 0;

  // functions

  function toggleSlot(rowId: string, slotIndex: number) {
    const levels = character.levels.map((row) => {
      if (row.id !== rowId) return row;
      const nowUsed = slotIndex < row.used ? slotIndex : row.used + 1;
      return { ...row, used: Math.min(Math.max(nowUsed, 0), row.total) };
    });
    onUpdateCharacter({ levels });
  }

  function togglePactSlot(i: number) {
    const pact = { ...character.pact };
    pact.used = i < pact.used ? i : pact.used + 1;
    pact.used = Math.min(Math.max(pact.used, 0), pact.slots);
    onUpdateCharacter({ pact });
  }

  function toggleArcanum(idx: number) {
    const arcana = character.pact.arcana.map((a, i) =>
      i === idx ? { ...a, used: !a.used } : a,
    );
    onUpdateCharacter({ pact: { ...character.pact, arcana } });
  }

  function getPreparedSpells(row: LevelRow) {
    const rowLevel = parseInt(row.label.replace(/\D/g, ""), 10) || 0;
    return spells.filter((s) => {
      if (!preparedSet.has(s.id)) return false;
      if (s.level === "cantrip") return rowLevel === 0;
      const spellLevel = parseInt(s.level, 10) || 0;
      return rowLevel > 0 && spellLevel <= rowLevel;
    });
  }

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
    onUpdateCharacter({
      pact: { ...pact, used: Math.min(pact.used + 1, pact.slots) },
    });
    setCastingSpellId(null);
  }

  if (rowEnabled)
    return (
      <div
        key={`level-${levelNum}`}
        className="level-section overflow-y-visible"
      >
        {/* Section heading */}
        <div className="level-heading">
          <span className="level-heading__title">
            {isCantrip ? "Cantrip" : `Level ${levelNum}`}
          </span>

          <div className="flex-1" />

          {!isCantrip && (
            <div className="level-heading__slots">
              {/* PACT slots */}
              {isPactLevel && (
                <SlotDisplay
                  type={"Pact"}
                  pact={pact}
                  togglePactSlot={togglePactSlot}
                />
              )}

              {/* SLOTS */}
              {row && (
                <SlotDisplay
                  type="Spell"
                  spellRow={row}
                  toggleSlot={toggleSlot}
                  isHigh={isHigh}
                />
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
            <div className="slots-empty-row">
              No prepared {isCantrip ? "cantrips" : "spells or mystic arcanum"}{" "}
              at this level.
            </div>
          )}

        {/* Arcanum rows — reuse SpellRow with arcanum variant */}
        {arcanumHere.map((arc) => {
          const globalIdx = pact.arcana.indexOf(arc);
          const arcSpell = arc.spellId
            ? spells.find((s) => s.id === arc.spellId)
            : null;
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
}
