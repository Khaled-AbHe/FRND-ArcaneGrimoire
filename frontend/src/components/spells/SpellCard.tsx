import { Spell } from "../../types";
import { levelLabel, schoolColor } from "../../utils/dice";
import { useState } from "react";
import { useDeleteSpell } from "../../hooks/spells/useDeleteSpell";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon,
  ClockIcon,
  RadiusIcon,
} from "../ui/Icons";

interface SpellCardProps {
  spell: Spell;
  onViewDetail: (spell: Spell) => void;
  onEdit: (spell: Spell) => void;
}

export function SpellCard({ spell, onViewDetail, onEdit }: SpellCardProps) {
  const deleteSpell = useDeleteSpell();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const color = schoolColor(spell.school);
  const iconSize = 14;

  function spellTags(spell: Spell) {
    return (
      <>
        {spell.level === "cantrip" ? "Cantrip " : `Level ${spell.level} `}•{" "}
        <span style={{ color }}>{spell.school}</span>
        {spell.concentration ? " • C" : undefined}
        {spell.ritual ? " • R" : undefined}
      </>
    );
  }

  return (
    <div
      className="spell-grid-card animate-fade-in"
      onClick={() => onViewDetail(spell)}
      role="article"
      aria-label={`${spell.name}, ${levelLabel(spell.level)} spell`}
    >
      <div className="flex flex-col gap-0 p-3">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div
              className="truncate font-display text-sm"
              style={{ color, letterSpacing: "0.06em" }}
            >
              {spell.name}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(spell);
              }}
              className="text-muted hover:text-dim flex h-[26px] w-[26px] items-center justify-center rounded-md text-xs transition-all hover:bg-white/5"
              aria-label={`Edit ${spell.name}`}
              title="Edit spell"
            >
              <PencilIcon size={iconSize} />
            </button>

            {confirmDelete === spell.id ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSpell.mutate(spell.id);
                    setConfirmDelete(null);
                  }}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-md text-xs text-red-400 transition-all hover:bg-red-400/10 hover:text-red-300"
                  aria-label={`Confirm delete ${spell.name}`}
                  title="Confirm delete"
                >
                  <CheckIcon size={iconSize} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(null);
                  }}
                  className="text-muted hover:text-dim flex h-[26px] w-[26px] items-center justify-center rounded-md text-xs transition-all hover:bg-white/5"
                  aria-label="Cancel delete"
                  title="Cancel"
                >
                  <CloseIcon size={iconSize} />
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(spell.id);
                }}
                className="text-muted flex h-[26px] w-[26px] items-center justify-center rounded-md text-xs transition-all hover:bg-red-400/10 hover:text-red-400"
                aria-label={`Delete ${spell.name}`}
                title="Delete spell"
              >
                <TrashIcon size={iconSize} />
              </button>
            )}
          </div>
        </div>

        <div className="divider my-0 mb-2" />

        {/* Type */}
        <div className="flex flex-wrap items-start gap-2">
          <div className="text-muted text-sm">{spellTags(spell)}</div>
        </div>

        <div className="my-0 mb-2" />

        {/* Cast time + range */}
        <div className="text-muted flex h-5 items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <ClockIcon />
            {spell.castTime}
          </span>
          <span className="flex w-[50%] items-center justify-end gap-1">
            <RadiusIcon />
            {spell.range}
          </span>
        </div>
      </div>
    </div>
  );
}
