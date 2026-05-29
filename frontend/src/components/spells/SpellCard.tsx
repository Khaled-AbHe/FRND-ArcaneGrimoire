import { Character, ComputedStats, Spell } from "../../types";
import { levelLabel } from "../../utils/dice";
import { SchoolBadge } from "../ui/SchoolBadge";
import { useState } from "react";
import { useDeleteSpell } from "../../hooks/spells/useDeleteSpell";
import { PencilIcon, TrashIcon, CheckIcon, CloseIcon, StarFilledIcon, StarEmptyIcon } from "../ui/Icons";

interface SpellCardProps {
  spell: Spell;
  character: Character;
  stats: ComputedStats;
  onViewDetail: (spell: Spell) => void;
  onEdit: (spell: Spell) => void;
  togglePrepare: (spellId: number) => void;
}

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

export default function SpellCard({
  spell,
  character,
  onViewDetail,
  onEdit,
  togglePrepare,
}: SpellCardProps) {
  const deleteSpell = useDeleteSpell();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const isPrepared = character.prepared.includes(spell.id);
  const color = schoolColor(spell.school);

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
            <div
              className="text-xs text-muted mt-0.5"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              {levelLabel(spell.level)}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePrepare(spell.id);
              }}
              className={`w-[26px] h-[26px] flex items-center justify-center rounded-md text-sm transition-all ${
                isPrepared
                  ? "text-amber-400 hover:bg-amber-400/10"
                  : "text-muted hover:bg-white/5 hover:text-amber-500"
              }`}
              aria-label={isPrepared ? `Unprepare ${spell.name}` : `Prepare ${spell.name}`}
              title={isPrepared ? "Unprepare" : "Prepare"}
            >
              {isPrepared ? <StarFilledIcon size={13} /> : <StarEmptyIcon size={13} />}
            </button>

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

        {/* School + flags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          <SchoolBadge school={spell.school} />
          {spell.concentration && (
            <span
              className="school-badge"
              style={{
                background: "rgba(51,65,85,0.6)",
                border: "1px solid rgba(148,163,184,0.3)",
                color: "#94a3b8",
                borderRadius: "6px",
              }}
              title="Concentration"
              aria-label="Concentration spell"
            >
              C
            </span>
          )}
          {spell.ritual && (
            <span
              className="school-badge"
              style={{
                background: "rgba(68,44,20,0.6)",
                border: "1px solid rgba(180,130,60,0.35)",
                color: "#d4a95a",
                borderRadius: "6px",
              }}
              title="Ritual"
              aria-label="Ritual spell"
            >
              R
            </span>
          )}
        </div>

        {/* Cast time + range */}
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <ClockIcon />
            {spell.castTime}
          </span>
          <span className="flex items-center gap-1">
            <RadiusIcon />
            {spell.range}
          </span>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      style={{ opacity: 0.5, flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RadiusIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      style={{ opacity: 0.5, flexShrink: 0 }}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <path
        d="M8 2v2M8 12v2M2 8h2M12 8h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.1 4.1l1.4 1.4M10.5 10.5l1.4 1.4M4.1 11.9l1.4-1.4M10.5 5.5l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
