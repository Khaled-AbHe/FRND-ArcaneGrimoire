import { useState, useMemo } from "react";
import { SpellDetailModal } from "./SpellDetailModal";
import type { Character, ComputedStats, Spell, SpellLevel } from "../../types";
import { useSpells } from "../../hooks/spells/useSpells";
import SpellPresenter from "./SpellPresenter";
import SpellToolbar from "./SpellToolbar";

interface SpellPreparerTabProps {
  character: Character;
  stats: ComputedStats;
  onUpdatePrepared: (prepared: number[]) => void;
}

/**
 * Prepare/unprepare spells for the active character.
 * No spell CRUD — that lives in the User Page Spell Manager.
 */
export function SpellPreparerTab({ character, stats, onUpdatePrepared }: SpellPreparerTabProps) {
  const { data: spells = [], isLoading } = useSpells();

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<SpellLevel | "">("");
  const [filterSchool, setFilterSchool] = useState("");
  const [showUnprepared, setShowUnprepared] = useState(true);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  const preparedSet = useMemo(() => new Set(character.prepared), [character.prepared]);

  const filtered = useMemo(
    () =>
      spells.filter((spell) => {
        if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterLevel && spell.level !== filterLevel) return false;
        if (filterSchool && spell.school !== filterSchool) return false;
        if (!showUnprepared && !preparedSet.has(spell.id)) return false;
        return true;
      }),
    [spells, search, filterLevel, filterSchool, showUnprepared, preparedSet],
  );

  function togglePrepare(spellId: number) {
    const next = preparedSet.has(spellId)
      ? character.prepared.filter((id) => id !== spellId)
      : [...character.prepared, spellId];
    onUpdatePrepared(next);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <SpellToolbar
        search={search}
        setSearch={setSearch}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        filterSchool={filterSchool}
        setFilterSchool={setFilterSchool}
      />

      {/* Spell grid */}
      <SpellPresenter isLoading={isLoading} spells={spells} filtered={filtered}>
        <></>
        {/* <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          role="list"
        >
          {filtered.map((spell) => (
            <div key={spell.id} role="listitem">
              <SpellCard
                spell={spell}
                character={character}
                stats={stats}
                onViewDetail={setDetailSpell}
                onEdit={() => {}}
                togglePrepare={togglePrepare}
                isPreparer={true}
              />
            </div>
          ))}
        </div> */}
      </SpellPresenter>

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
