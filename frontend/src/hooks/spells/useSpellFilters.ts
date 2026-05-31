import { useMemo, useState } from "react";
import type { Spell, SpellLevel } from "../../types";

interface UseSpellFiltersOptions {
  /** When provided, enables a showUnprepared toggle that hides spells in this set. */
  preparedSet?: Set<number>;
}

/**
 * Manages spell filter state and returns the filtered spell array.
 * Used by SpellManagerTab, SpellPreparerTab, and SpellsTab.
 *
 * Pass `preparedSet` to enable the showUnprepared toggle — the hook owns
 * that state internally so there's no circular reference at the call site.
 */
export function useSpellFilters(spells: Spell[], options: UseSpellFiltersOptions = {}) {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<SpellLevel | "">("");
  const [filterSchool, setFilterSchool] = useState("");
  const [showUnprepared, setShowUnprepared] = useState(true);

  const filtered = useMemo(
    () =>
      spells.filter((spell) => {
        if (!showUnprepared && options.preparedSet && !options.preparedSet.has(spell.id))
          return false;
        if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterLevel && spell.level !== filterLevel) return false;
        if (filterSchool && spell.school !== filterSchool) return false;
        return true;
      }),
    [spells, options.preparedSet, showUnprepared, search, filterLevel, filterSchool],
  );

  const hasFilters = Boolean(search || filterLevel || filterSchool);

  function clearFilters() {
    setSearch("");
    setFilterLevel("");
    setFilterSchool("");
    setShowUnprepared(true);
  }

  return {
    filtered,
    hasFilters,
    search,
    setSearch,
    filterLevel,
    setFilterLevel,
    filterSchool,
    setFilterSchool,
    showUnprepared,
    setShowUnprepared,
    clearFilters,
  };
}
