import { LevelRow, PactMagic } from "../../types";

type SlotDisplayProps =
  | {
      type: "Spell";
      spellRow: LevelRow;
      toggleSlot: (rowId: string, slotIndex: number) => void;
      isHigh: boolean;
      pact?: never;
      togglePactSlot?: never;
    }
  | {
      type: "Pact";
      spellRow?: never;
      toggleSlot?: never;
      isHigh?: never;
      pact: PactMagic;
      togglePactSlot: (param: number) => void;
    };

export function SlotDisplay({
  type,
  spellRow,
  toggleSlot,
  isHigh,
  pact,
  togglePactSlot,
}: SlotDisplayProps) {
  return (
    <div className="slot-pip-group">
      <div className="slot-pip-spellRow" role="group">
        {type === "Spell"
          ? Array.from({ length: spellRow.total }).map((_, i) => (
              <button
                key={i}
                onClick={() => toggleSlot(spellRow.id, i)}
                aria-label={
                  i < spellRow.used
                    ? `Slot ${i + 1} expended — click to restore`
                    : `Slot ${i + 1} available — click to expend`
                }
                aria-pressed={i >= spellRow.used}
                className={`slot-pip ${i < spellRow.used ? "slot-pip--used" : ""}${isHigh ? "slot-pip--high" : ""} ml-1`}
              />
            ))
          : Array.from({ length: pact.slots }).map((_, i) => (
              <button
                key={i}
                onClick={() => togglePactSlot(i)}
                aria-label={
                  i < pact.used
                    ? `Pact slot ${i + 1} expended`
                    : `Pact slot ${i + 1} available`
                }
                aria-pressed={i >= pact.used}
                className={`pact-pip ${i < pact.used ? "pact-pip--used" : ""} ml-1`}
              />
            ))}
      </div>
      <span className="slots-label">{type.toUpperCase()}</span>
    </div>
  );
}
