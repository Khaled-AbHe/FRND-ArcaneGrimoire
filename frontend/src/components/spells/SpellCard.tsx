import { Spell } from "../../types";
import { levelLabel } from "../../utils/dice";
import { useState } from "react";
import { useDeleteSpell } from "../../hooks/spells/useDeleteSpell";
import { PencilIcon, TrashIcon, CheckIcon, CloseIcon, ClockIcon, RadiusIcon } from "../ui/Icons";

function schoolColor(school: string): string {
  const map: Record<string, string> = {
    illusion: "rgba(168, 85, 247)",
    evocation: "rgba(255, 0, 0)",
    conjuration: "rgba(14, 165, 233)",
    abjuration: "rgba(97, 102, 241)",
    divination: "rgba(234, 179, 8)",
    enchantment: "rgba(217, 70, 239)",
    necromancy: "rgba(16, 185, 129)",
    transmutation: "rgba(249, 115, 22)",
  };
  return map[school?.toLowerCase()] ?? "rgba(36, 237, 251, 0.9)";
}

interface SpellCardProps {
  spell: Spell;
  onViewDetail: (spell: Spell) => void;
  onEdit: (spell: Spell) => void;
}

export default function SpellCard({ spell, onViewDetail, onEdit }: SpellCardProps) {
  const deleteSpell = useDeleteSpell();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const color = schoolColor(spell.school);

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
      <div className="p-3 flex flex-col gap-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div
              className="font-display text-sm truncate"
              style={{ color, letterSpacing: "0.06em" }}
            >
              {spell.name}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(spell);
              }}
              className="w-[26px] h-[26px] flex items-center justify-center rounded-md text-xs text-muted hover:bg-white/5 hover:text-dim transition-all"
              aria-label={`Edit ${spell.name}`}
              title="Edit spell"
            >
              <PencilIcon size={12} />
            </button>

            {confirmDelete === spell.id ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSpell.mutate(spell.id);
                    setConfirmDelete(null);
                  }}
                  className="w-[26px] h-[26px] flex items-center justify-center rounded-md text-xs text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all"
                  aria-label={`Confirm delete ${spell.name}`}
                  title="Confirm delete"
                >
                  <CheckIcon size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(null);
                  }}
                  className="w-[26px] h-[26px] flex items-center justify-center rounded-md text-xs text-muted hover:bg-white/5 hover:text-dim transition-all"
                  aria-label="Cancel delete"
                  title="Cancel"
                >
                  <CloseIcon size={12} />
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(spell.id);
                }}
                className="w-[26px] h-[26px] flex items-center justify-center rounded-md text-xs text-muted hover:bg-red-400/10 hover:text-red-400 transition-all"
                aria-label={`Delete ${spell.name}`}
                title="Delete spell"
              >
                <TrashIcon size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="divider my-0 mb-2" />

        {/* Type */}
        <div className="flex flex-wrap items-start gap-2">
          <div className="text-sm text-muted">{spellTags(spell)}</div>
        </div>

        <div className="my-0 mb-2" />

        {/* Cast time + range */}
        <div className="flex items-center justify-between text-xs text-muted h-5 ">
          <span className="flex items-center gap-1">
            <ClockIcon />
            {spell.castTime}
          </span>
          <span className="flex justify-end items-center gap-1 w-[50%]">
            <RadiusIcon />
            {spell.range}
          </span>
        </div>
      </div>
    </div>
  );
}
