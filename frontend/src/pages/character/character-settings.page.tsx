import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../components/shells/page-shell.component";
import { Modal } from "../../components/ui/Modal";
import { useDeleteCharacter } from "../../hooks/characters/useDeleteCharacter";
import type { Character, CharacterGlobals, ComputedStats } from "../../types";
import { fmtBonus } from "../../utils/dice";

interface CharacterSettingsPageProps {
  character: Character;
  stats: ComputedStats;
  onUpdateCharacter: (patch: Partial<Character>) => void;
}

export function CharacterSettingsPage({
  character,
  stats,
  onUpdateCharacter,
}: CharacterSettingsPageProps) {
  const navigate = useNavigate();
  const deleteChar = useDeleteCharacter();

  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(character.name);

  // Keep name input in sync if character updates externally
  useEffect(() => {
    setNameInput(character.name);
  }, [character.name]);

  const globals = character.globals ?? { mod: 0, prof: 2, charLevel: 1, highMagic: false };

  function setGlobal<K extends keyof CharacterGlobals>(key: K, value: CharacterGlobals[K]) {
    onUpdateCharacter({ globals: { ...globals, [key]: value } });
  }

  function handleRename() {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === character.name) {
      setRenaming(false);
      return;
    }
    onUpdateCharacter({ name: trimmed });
    setRenaming(false);
  }

  function handleDelete() {
    deleteChar.mutate(character.id, {
      onSuccess: () => navigate("/"),
    });
    setDeleteConfirmOpen(false);
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
    <PageShell>
      <div className="mx-auto my-10 space-y-6 min-w-[40%] max-w-[90%] overflow-y-auto">
        {/* Character name */}
        <section aria-labelledby="section-name">
          <h2
            id="section-name"
            className="font-display text-xs uppercase tracking-widest text-accent mb-3 m-auto"
          >
            Character
          </h2>
          <div className="card p-4">
            {renaming ? (
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") {
                      setRenaming(false);
                      setNameInput(character.name);
                    }
                  }}
                  autoFocus
                  maxLength={64}
                />
                <button className="btn-ghost text-sm" onClick={handleRename}>
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-5 ">
                <span className="font-display text-base text-accent tracking-wide">
                  {character.name}
                </span>
                <button className="btn-ghost text-xs px-3" onClick={() => setRenaming(true)}>
                  Rename
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Statistics */}
        <section aria-labelledby="section-spellcasting">
          <h2
            id="section-spellcasting"
            className="font-display text-xs uppercase tracking-widest text-accent mb-3 m-auto"
          >
            Statistics
          </h2>
          <div className="card p-4 space-y-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col h-fit gap-5">
                <div className="flex flex-col items-center w-full">
                  <label htmlFor="spell-mod" className="label">
                    Spellcasting Modifier
                  </label>
                  <input
                    id="spell-mod"
                    type="number"
                    className="text-2xl text-center font-display card w-full text-accent rounded"
                    min={-5}
                    max={10}
                    value={globals.mod}
                    onChange={(e) => setGlobal("mod", +e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center w-full">
                  <label htmlFor="prof-bonus" className="label">
                    Proficiency Bonus
                  </label>
                  <input
                    id="prof-bonus"
                    type="number"
                    className="text-2xl text-center font-display card w-full text-accent rounded"
                    min={2}
                    max={9}
                    value={globals.prof}
                    onChange={(e) => setGlobal("prof", +e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center w-full">
                  <label htmlFor="char-level" className="label">
                    Character Level (1-20)
                  </label>
                  <input
                    id="char-level"
                    type="number"
                    className="text-2xl text-center font-display card w-full text-accent rounded"
                    min={1}
                    max={20}
                    value={globals.charLevel}
                    onChange={(e) => setGlobal("charLevel", +e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col h-[100%] gap-5 justify-end">
                <div className="flex flex-col items-center w-full justify-center">
                  <div className="label">Spell Save DC</div>
                  <div className="text-2xl flex justify-center font-display card w-full text-accent rounded">
                    {stats.spellSaveDC}
                  </div>
                </div>
                <div className="flex flex-col items-center w-full">
                  <div className="label">Spell Attack Bonus</div>
                  <div className="text-2xl flex justify-center font-display card w-full text-accent rounded">
                    {fmtBonus(stats.attackBonus).replace(" ", "")}
                  </div>
                </div>
                <div className="flex flex-col items-center w-full">
                  <div className="label">Cantrip Tier (Dice/Projectiles)</div>
                  <div className="text-2xl flex justify-center font-display card w-full text-accent rounded">
                    {stats.cantripTier}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section aria-labelledby="section-danger">
          <h2
            id="section-danger"
            className="font-display text-xs uppercase tracking-widest mb-3 m-auto"
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
                className="flex btn-danger text-xs w-[20%] justify-center"
                onClick={() => setClearConfirmOpen(true)}
              >
                Clear
              </button>
            </div>
            <div className="border-t" style={{ borderColor: "rgba(239,68,68,0.15)" }} />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Delete Character
                </div>
                <div className="text-xs text-muted">Permanently removes this character</div>
              </div>
              <button
                className="flex btn-danger text-xs w-[20%] justify-center"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <Modal
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        title="Confirm Clear"
        width="max-w-sm"
      >
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Reset all slots, pact, and prepared spells for{" "}
          <strong style={{ color: "var(--text-primary)" }}>{character.name}</strong>? This cannot be
          undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost text-sm px-4" onClick={() => setClearConfirmOpen(false)}>
            Cancel
          </button>
          <button className="btn-danger text-sm px-4" onClick={clearCharacterData} autoFocus>
            Clear Data
          </button>
        </div>
      </Modal>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Character"
        width="max-w-sm"
      >
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Permanently delete{" "}
          <strong style={{ color: "var(--text-primary)" }}>{character.name}</strong>? This cannot be
          undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost text-sm px-4" onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </button>
          <button className="btn-danger text-sm px-4" onClick={handleDelete} autoFocus>
            Delete
          </button>
        </div>
      </Modal>
    </PageShell>
  );
}
