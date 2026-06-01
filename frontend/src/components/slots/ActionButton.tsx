import { Spell } from "../../types";
import { ArcanumRowVariant, SpellRowVariant } from "./rows/SpellRow";

interface ActionButtonProps {
  spell: Spell;
  variant: SpellRowVariant | ArcanumRowVariant;
}

export function ActionButton({ spell, variant }: ActionButtonProps) {
  if (variant.kind === "arcanum") {
    return (
      <div className="flex justify-end items-center h-[35px] min-w-[62px] p-1">
        <button
          disabled={variant.arcUsed}
          onClick={variant.onCastArcanum}
          className={
            `${variant.arcUsed ? "btn-arcanum-dis" : "btn-arcanum"}` +
            " w-[50px] h-full text-[15px] justify-center"
          }
          aria-label={variant.arcUsed ? "Arcanum expended" : `Cast ${spell.name} as Mystic Arcanum`}
          title={variant.arcUsed ? "Arcanum Expended" : "Cast as Mystic Arcanum"}
        >
          Arc
        </button>
      </div>
    );
  }

  // Cast variant
  const {
    row,
    isPactLevel,
    pactSlotsLeft,
    slotsLeft,
    isCantrip,
    canCast,
    castingSpellId,
    onCastFromRow,
    onCastFromPact,
    setCastingSpellId,
  } = variant;
  const castId = `${spell.id}:${variant.levelNum}`;
  const hasBoth = row && slotsLeft > 0 && isPactLevel && pactSlotsLeft > 0;

  return (
    <div className="relative flex justify-end items-center h-[35px] min-w-[62px] p-1">
      <button
        disabled={!canCast && !isCantrip}
        onClick={(e) => {
          e.stopPropagation();
          if (isCantrip) return;
          if (hasBoth) {
            setCastingSpellId(castingSpellId === castId ? null : castId);
          } else if (isPactLevel && pactSlotsLeft > 0) {
            onCastFromPact(spell);
          } else if (row && slotsLeft > 0) {
            onCastFromRow(spell, row);
          }
        }}
        className={
          `${canCast ? "btn-primary" : "btn-primary-dis"}` +
          " w-[50px] h-full text-[15px] justify-center"
        }
        aria-label={isCantrip ? `Cast ${spell.name} (cantrip)` : `Cast ${spell.name}`}
      >
        Cast
      </button>

      {/* Slot source popover — only when both pact and regular slots available */}
      {castingSpellId === castId && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1 z-50 flex flex-col overflow-hidden rounded shadow-lg"
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            minWidth: 110,
          }}
          role="menu"
          aria-label="Choose slot type"
        >
          {row && slotsLeft > 0 && (
            <button
              className="px-3 py-2 text-xs text-left hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ color: "var(--accent)" }}
              onClick={() => onCastFromRow(spell, row)}
              role="menuitem"
            >
              Spell Slot
            </button>
          )}
          {isPactLevel && pactSlotsLeft > 0 && (
            <button
              className="px-3 py-2 text-xs text-left hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ color: "#a855f7" }}
              onClick={() => onCastFromPact(spell)}
              role="menuitem"
            >
              Pact Slot
            </button>
          )}
        </div>
      )}
    </div>
  );
}
