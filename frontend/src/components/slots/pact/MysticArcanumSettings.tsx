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
        {ARCANUM_LEVELS.map((level) => {
          const arc = getArcanum(level);
          const enabled = arc !== null;
          const levelSpells = spells
            ? spells.filter((s) => parseInt(s.level, 10) === level)
            : [];

          return (
            <div
              key={level}
              className="flex items-center gap-3 rounded px-3 py-2"
              style={{
                background: "var(--bg-primary)",
                border: `1px solid ${enabled ? "#a855f7" : "var(--border)"}`,
                opacity: enabled ? 1 : 0.5,
                transition: "all 0.15s",
              }}
            >
              {/* Enable toggle */}
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => toggleArcanum(level, e.target.checked)}
              />

              {/* Level label */}
              <span
                className="w-16 shrink-0 font-display text-xs tracking-wider"
                style={{ color: enabled ? "#a855f7" : "var(--text-muted)" }}
              >
                Level {level}
              </span>

              {/* Spell picker */}
              <select
                className="select flex-1 text-xs"
                disabled={!enabled}
                value={arc?.spellId ?? ""}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
