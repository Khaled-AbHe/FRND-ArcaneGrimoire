import { useState, useMemo } from "react";
import { SpellFormModal } from "../spells/SpellFormModal";
import { SpellDetailModal } from "../spells/SpellDetailModal";
import type { Spell, SpellLevel } from "../../types";
import { useSpells } from "../../hooks/spells/useSpells";
import SpellCard from "../spells/SpellCard";
import SpellPresenter from "../spells/SpellPresenter";
import SpellToolbar from "../spells/SpellToolbar";

/**
 * Full spell CRUD — create, edit, delete.
 * Lives on the User Page, no character context needed.
 */
export function SpellManagerTab() {
  const { data: spells = [], isLoading } = useSpells();

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<SpellLevel | "">("");
  const [filterSchool, setFilterSchool] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editSpell, setEditSpell] = useState<Spell | null>(null);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  const filtered = useMemo(
    () =>
      spells.filter((spell) => {
        if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterLevel && spell.level !== filterLevel) return false;
        if (filterSchool && spell.school !== filterSchool) return false;
        return true;
      }),
    [spells, search, filterLevel, filterSchool],
  );

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
        setEditSpell={setEditSpell}
        setFormOpen={setFormOpen}
      />

      {/* Spell grid */}
      <SpellPresenter isLoading={isLoading} spells={spells} filtered={filtered}>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          role="list"
        >
          {filtered.map((spell) => (
            <div key={spell.id} role="listitem">
              <SpellCard
                spell={spell}
                onViewDetail={setDetailSpell}
                onEdit={(s) => {
                  setEditSpell(s);
                  setFormOpen(true);
                }}
              />
            </div>
          ))}
        </div>
      </SpellPresenter>

      <SpellFormModal open={formOpen} onClose={() => setFormOpen(false)} editing={editSpell} />
      <SpellDetailModal
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
        spell={detailSpell}
      />
    </div>
  );
}
