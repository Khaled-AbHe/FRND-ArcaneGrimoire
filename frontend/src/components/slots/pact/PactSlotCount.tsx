import { IncrementableValue } from "../../ui/IncrementableValue";
import { Pill } from "../../ui/Pill";
import PactSettingsProps from "./PactSettingsProps";

export default function PactSlotCount({
  pactMagic,
  onUpdate,
}: PactSettingsProps) {
  const slotSettings = [
    {
      title: "Slot Count",
      value: pactMagic.slots,
      key: "slots",
      min: 1,
      max: 4,
    },
    {
      title: "Slot Level",
      value: pactMagic.slotLevel,
      key: "slotLevel",
      min: 1,
      max: 5,
    },
  ];

  function handlePactMagic(value: number, key: any) {
    const clamped = Math.min(5, Math.max(1, value));
    pactMagic = { ...pactMagic, [key]: clamped };
    onUpdate({ ...pactMagic, [key]: clamped });
  }

  return slotSettings.map(({ title, value, key, min, max }, i) => (
    <Pill key={`Pact ${key}`} title={title} pillColor="#a855f7">
      <IncrementableValue
        key={`${key + i}`}
        value={value}
        setValue={handlePactMagic}
        min={min}
        max={max}
        mapKey={key}
        btnColor="#a855f7"
      />
    </Pill>
  ));
}
