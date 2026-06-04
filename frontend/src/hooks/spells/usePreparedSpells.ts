import { useMemo } from "react";
import type { Character, Spell } from "../../types";

/**
 * Derives prepared/unprepared spell lists and provides a toggle function.
 * Used by SpellPreparerTab and SpellsTab.
 */
export function usePreparedSpells(
  spells: Spell[],
  character: Character,
  onUpdatePrepared: (prepared: number[]) => void,
) {
  const preparedSet = useMemo(
    () => new Set(character.prepared),
    [character.prepared],
  );

  const preparedSpells = useMemo(
    () => spells.filter((s) => preparedSet.has(s.id)),
    [spells, preparedSet],
  );

  const unpreparedSpells = useMemo(
    () => spells.filter((s) => !preparedSet.has(s.id)),
    [spells, preparedSet],
  );

  function togglePrepare(spellId: number) {
    const next = preparedSet.has(spellId)
      ? character.prepared.filter((id) => id !== spellId)
      : [...character.prepared, spellId];
    onUpdatePrepared(next);
  }

  return {
    preparedSet,
    preparedSpells,
    unpreparedSpells,
    togglePrepare,
  };
}
