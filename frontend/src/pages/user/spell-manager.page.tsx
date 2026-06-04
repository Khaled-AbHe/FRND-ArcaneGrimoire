import { useState } from "react";
import type { Spell } from "../../types";
import { useSpells } from "../../hooks/spells/useSpells";
import { SpellToolbar } from "../../components/spells/SpellToolbar";
import { SpellCard } from "../../components/spells/SpellCard";
import { SpellPresenter } from "../../components/spells/SpellPresenter";
import { SpellFormModal } from "../../components/spells/modals/SpellFormModal";
import { SpellDetailModal } from "../../components/spells/modals/SpellDetailModal";
import { useSpellFilters } from "../../hooks/spells/useSpellFilters";

/**
 * Full spell CRUD — create, edit, delete.
 * Lives on the User Page, no character context needed.
 */
export function SpellManagerPage() {
  const { data: spells = [], isLoading } = useSpells();

  const [formOpen, setFormOpen] = useState(false);
  const [editSpell, setEditSpell] = useState<Spell | null>(null);

  const filters = useSpellFilters(spells);
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-hidden">
      {/* Toolbar */}
      <SpellToolbar
        search={filters.search}
        setSearch={filters.setSearch}
        filterLevel={filters.filterLevel}
        setFilterLevel={filters.setFilterLevel}
        filterSchool={filters.filterSchool}
        setFilterSchool={filters.setFilterSchool}
        setEditSpell={setEditSpell}
        setFormOpen={setFormOpen}
      />

      {/* Spell grid */}
      <SpellPresenter
        isLoading={isLoading}
        spellCount={spells.length}
        filteredCount={filters.filtered.length}
      >
        <div
          className="grid w-[85%] grid-cols-1 gap-3 justify-self-center sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {filters.filtered.map((spell) => (
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

      <SpellFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editSpell}
      />
      <SpellDetailModal
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
        spell={detailSpell}
      />
    </div>
  );
}
