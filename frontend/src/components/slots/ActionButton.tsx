import { Spell } from "../../types";
import { ContextOption } from "../ui/ContextMenu/ContextOption";
import { ContextMenu } from "../ui/ContextMenu/ContextMenu";
import { ArcanumRowVariant, SpellRowVariant } from "./rows/SpellRow";

interface ActionButtonProps {
  spell: Spell;
  variant: SpellRowVariant | ArcanumRowVariant;
}

export function ActionButton({ spell, variant }: ActionButtonProps) {
  if (variant.kind === "arcanum") {
    return (
      <div className="flex h-[35px] min-w-[62px] items-center justify-end p-1">
        <button
          disabled={variant.arcUsed}
          onClick={variant.onCastArcanum}
          className={
            `${variant.arcUsed ? "btn-arcanum-dis" : "btn-arcanum"}` +
            " h-full w-[50px] justify-center text-[15px]"
          }
          aria-label={
            variant.arcUsed
              ? "Arcanum expended"
              : `Cast ${spell.name} as Mystic Arcanum`
          }
          title={
            variant.arcUsed ? "Arcanum Expended" : "Cast as Mystic Arcanum"
          }
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
    <div className="relative flex h-[35px] min-w-[62px] items-center justify-end p-1">
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
          " h-full w-[50px] justify-center text-[15px]"
        }
        aria-label={
          isCantrip ? `Cast ${spell.name} (cantrip)` : `Cast ${spell.name}`
        }
      >
        Cast
      </button>

      {/* Slot source popover — only when both pact and regular slots available */}
      {castingSpellId === castId && (
        <ContextMenu onClose={(e) => e.stopPropagation()}>
          {row && slotsLeft > 0 && (
            <ContextOption
              title="Spell Slot"
              color="var(--accent)"
              onClick={() => onCastFromRow(spell, row)}
            />
          )}
          {isPactLevel && pactSlotsLeft > 0 && (
            <ContextOption
              title="Pact Slot"
              color="var(--pact-full)"
              onClick={() => onCastFromPact(spell)}
            />
          )}
        </ContextMenu>
      )}
    </div>
  );
}
