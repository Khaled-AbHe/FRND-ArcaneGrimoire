import { useState } from "react";
import type { Character, CharacterGlobals, ComputedStats } from "../../types";
import { fmtBonus } from "../../utils/dice";
import { Modal } from "../ui/Modal";

interface SettingsTabProps {
  character: Character;
  stats: ComputedStats;
  onUpdateCharacter: (patch: Partial<Character>) => void;
}

export function SettingsTab({ character, stats, onUpdateCharacter }: SettingsTabProps) {
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const globals = character.globals ?? {
    mod: 0,
    prof: 2,
    charLevel: 1,
    highMagic: false,
  };

  function setGlobal<K extends keyof CharacterGlobals>(key: K, value: CharacterGlobals[K]) {
    onUpdateCharacter({ globals: { ...globals, [key]: value } });
  }

  function clearCharacterData() {
    onUpdateCharacter({
      levels: character.levels.map((r) => ({ ...r, used: 0 })),
      prepared: [],
      pact: {
        ...character.pact,
        used: 0,
        arcana: character.pact.arcana.map((a) => ({ ...a, used: false })),
      },
    });
    setClearConfirmOpen(false);
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Spellcasting stats */}
      <section aria-labelledby="section-spellcasting">
        <h2
          id="section-spellcasting"
          className="font-display text-xs uppercase tracking-widest text-accent mb-3 w-[80%] m-auto"
        >
          Spellcasting
        </h2>
        <div className="card p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="spell-mod" className="label">
                Spellcasting Modifier
              </label>
              <input
                id="spell-mod"
                type="number"
                className="input"
                min={-5}
                max={10}
                value={globals.mod}
                onChange={(e) => setGlobal("mod", +e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="prof-bonus" className="label">
                Proficiency Bonus
              </label>
              <input
                id="prof-bonus"
                type="number"
                className="input"
                min={2}
                max={9}
                value={globals.prof}
                onChange={(e) => setGlobal("prof", +e.target.value)}
              />
            </div>
          </div>

          {/* Live computed values */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded p-3 text-center"
              style={{ background: "var(--bg-raised)" }}
              aria-label={`Spell Save DC: ${stats.spellSaveDC}`}
            >
              <div className="label">Spell Save DC</div>
              <div className="text-3xl font-display text-accent">{stats.spellSaveDC}</div>
              <div className="text-xs text-muted mt-0.5">
                8 + {globals.prof} + {globals.mod}
              </div>
            </div>
            <div
              className="rounded p-3 text-center"
              style={{ background: "var(--bg-raised)" }}
              aria-label={`Spell Attack Bonus: ${fmtBonus(stats.attackBonus)}`}
            >
              <div className="label">Spell Attack Bonus</div>
              <div className="text-3xl font-display text-accent">{fmtBonus(stats.attackBonus)}</div>
              <div className="text-xs text-muted mt-0.5">
                {globals.prof} + {globals.mod}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Character level */}
      <section aria-labelledby="section-character">
        <h2
          id="section-character"
          className="font-display text-xs uppercase tracking-widest text-accent mb-3 w-[80%] m-auto"
        >
          Character
        </h2>
        <div className="card p-4 space-y-4">
          <div>
            <label htmlFor="char-level" className="label">
              Character Level (1-20)
            </label>
            <input
              id="char-level"
              type="number"
              className="input"
              min={1}
              max={20}
              value={globals.charLevel}
              onChange={(e) => setGlobal("charLevel", +e.target.value)}
            />
            <p className="text-xs text-muted mt-1">
              Cantrip damage tier: <span className="text-accent">{stats.cantripTier}</span> dice
              {globals.charLevel >= 5 ? ` (from level ${globals.charLevel})` : ""}
            </p>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section aria-labelledby="section-danger">
        <h2
          id="section-danger"
          className="font-display text-xs uppercase tracking-widest mb-3 w-[80%] m-auto"
          style={{ color: "#ef4444" }}
        >
          Danger Zone
        </h2>
        <div className="card p-4 space-y-3" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Clear Character Data
              </div>
              <div className="text-xs text-muted">Reset all slots, pact, and prepared spells</div>
            </div>
            <button
              className="btn-danger text-xs"
              onClick={() => setClearConfirmOpen(true)}
              aria-label="Clear all character slot and prepared spell data"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* Accessible confirmation modal — replaces window.confirm() */}
      <Modal
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        title="Confirm Clear"
        width="max-w-sm"
      >
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Reset all slots, pact, and prepared spells for{" "}
          <strong style={{ color: "var(--text-primary)" }}>{character.name}</strong>? This cannot
          be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            className="btn-ghost text-sm px-4"
            onClick={() => setClearConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn-danger text-sm px-4"
            onClick={clearCharacterData}
            autoFocus
          >
            Clear Data
          </button>
        </div>
      </Modal>
    </div>
  );
}
