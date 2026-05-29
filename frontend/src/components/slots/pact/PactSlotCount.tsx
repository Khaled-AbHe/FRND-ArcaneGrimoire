import PactSettingsProps from "./PactSettingsProps";

export default function PactSlotCount({ pactMagic, onUpdate }: PactSettingsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="label">Slot Count</label>
        <input
          type="number"
          className="input"
          min={1}
          max={4}
          value={pactMagic.slots}
          onChange={(e) => onUpdate({ ...pactMagic, slots: +e.target.value })}
        />
      </div>
      <div>
        <label className="label">Slot Level (1-5)</label>
        <input
          type="number"
          className="input"
          min={1}
          max={5}
          value={pactMagic.slotLevel}
          onChange={(e) => onUpdate({ ...pactMagic, slotLevel: +e.target.value })}
        />
      </div>
    </div>
  );
}
