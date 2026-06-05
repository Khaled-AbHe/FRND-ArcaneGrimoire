import { ToggleablePill } from "../../ui/ToggleablePill";
import PactSettingsProps from "./PactSettingsProps";

const ARCANUM_LEVELS = [6, 7, 8, 9] as const;

export default function MysticArcanumSettings({
  pactMagic,
  spells,
  onUpdate,
}: PactSettingsProps) {
  function getArcanum(level: number) {
    return pactMagic.arcana?.find((a) => a.level === level) ?? null;
  }

  function toggleArcanum(level: number, enabled: boolean) {
    const arcana = pactMagic.arcana ?? [];
    if (enabled) {
      onUpdate({
        ...pactMagic,
        arcana: [...arcana, { level, spellId: null, used: false }],
      });
    } else {
      onUpdate({
        ...pactMagic,
        arcana: arcana.filter((a) => a.level !== level),
      });
    }
  }

  function setArcanumSpell(level: number, spellId: number | null) {
    const arcana = (pactMagic.arcana ?? []).map((a) =>
      a.level === level ? { ...a, spellId } : a,
    );
    onUpdate({ ...pactMagic, arcana });
  }

  return (
    <div>
      <label className="label mb-3 block">Mystic Arcanum</label>
      <div className="space-y-2">
        {ARCANUM_LEVELS.map((level, i) => {
          const arc = getArcanum(level);
          const enabled = arc !== null;
          const levelSpells = spells
            ? spells.filter((s) => parseInt(s.level, 10) === level)
            : [];

          return (
            <ToggleablePill
              key={`Arcanum ${i}`}
              title={`Level ${level}`}
              enabled={enabled}
              togglePill={() => toggleArcanum(level, !enabled)}
              pillColor="#a855f7"
            >
              <select
                className="select w-full flex-1 text-xs"
                disabled={!enabled}
                value={arc?.spellId ?? ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setArcanumSpell(
                    level,
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">— Link spell —</option>
                {levelSpells.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </ToggleablePill>
          );
        })}
      </div>
    </div>
  );
}
