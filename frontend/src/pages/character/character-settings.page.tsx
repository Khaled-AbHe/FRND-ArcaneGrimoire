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

  const globals = character.globals ?? {
    mod: 0,
    prof: 2,
    charLevel: 1,
    highMagic: false,
  };

  function setGlobal<K extends keyof CharacterGlobals>(
    key: K,
    value: CharacterGlobals[K],
  ) {
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
      <div className="mx-auto my-10 min-w-[40%] max-w-[90%] space-y-6 overflow-y-auto">
        {/* Character name */}
        <section aria-labelledby="section-name">
          <h2
            id="section-name"
            className="text-accent m-auto mb-3 font-display text-xs uppercase tracking-widest"
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
              <div className="flex items-center justify-between gap-5">
                <span className="text-accent font-display text-base tracking-wide">
                  {character.name}
                </span>
                <button
                  className="btn-ghost px-3 text-xs"
                  onClick={() => setRenaming(true)}
                >
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
            className="text-accent m-auto mb-3 font-display text-xs uppercase tracking-widest"
          >
            Statistics
          </h2>
          <div className="card space-y-4 p-4">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex h-fit flex-col gap-5">
                <div className="flex w-full flex-col items-center">
                  <label htmlFor="spell-mod" className="label">
                    Spellcasting Modifier
                  </label>
                  <input
                    id="spell-mod"
                    type="number"
                    className="card text-accent w-full rounded text-center font-display text-2xl"
                    min={-5}
                    max={10}
                    value={globals.mod}
                    onChange={(e) => setGlobal("mod", +e.target.value)}
                  />
                </div>
                <div className="flex w-full flex-col items-center">
                  <label htmlFor="prof-bonus" className="label">
                    Proficiency Bonus
                  </label>
                  <input
                    id="prof-bonus"
                    type="number"
                    className="card text-accent w-full rounded text-center font-display text-2xl"
                    min={2}
                    max={9}
                    value={globals.prof}
                    onChange={(e) => setGlobal("prof", +e.target.value)}
                  />
                </div>
                <div className="flex w-full flex-col items-center">
                  <label htmlFor="char-level" className="label">
                    Character Level (1-20)
                  </label>
                  <input
                    id="char-level"
                    type="number"
                    className="card text-accent w-full rounded text-center font-display text-2xl"
                    min={1}
                    max={20}
                    value={globals.charLevel}
                    onChange={(e) => setGlobal("charLevel", +e.target.value)}
                  />
                </div>
              </div>

              <div className="flex h-[100%] flex-col justify-end gap-5">
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="label">Spell Save DC</div>
                  <div className="card text-accent flex w-full justify-center rounded font-display text-2xl">
                    {stats.spellSaveDC}
                  </div>
                </div>
                <div className="flex w-full flex-col items-center">
                  <div className="label">Spell Attack Bonus</div>
                  <div className="card text-accent flex w-full justify-center rounded font-display text-2xl">
                    {fmtBonus(stats.attackBonus).replace(" ", "")}
                  </div>
                </div>
                <div className="flex w-full flex-col items-center">
                  <div className="label">Cantrip Tier (Dice/Projectiles)</div>
                  <div className="card text-accent flex w-full justify-center rounded font-display text-2xl">
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
            className="m-auto mb-3 font-display text-xs uppercase tracking-widest"
            style={{ color: "#ef4444" }}
          >
            Danger Zone
          </h2>
          <div
            className="card space-y-3 p-4"
            style={{ borderColor: "rgba(239,68,68,0.2)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Clear Character Data
                </div>
                <div className="text-muted text-xs">
                  Reset all slots, pact, and prepared spells
                </div>
              </div>
              <button
                className="btn-danger flex w-[20%] justify-center text-xs"
                onClick={() => setClearConfirmOpen(true)}
              >
                Clear
              </button>
            </div>
            <div
              className="border-t"
              style={{ borderColor: "rgba(239,68,68,0.15)" }}
            />
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Delete Character
                </div>
                <div className="text-muted text-xs">
                  Permanently removes this character
                </div>
              </div>
              <button
                className="btn-danger flex w-[20%] justify-center text-xs"
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
        <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
          Reset all slots, pact, and prepared spells for{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {character.name}
          </strong>
          ? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn-ghost px-4 text-sm"
            onClick={() => setClearConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn-danger px-4 text-sm"
            onClick={clearCharacterData}
            autoFocus
          >
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
        <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
          Permanently delete{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {character.name}
          </strong>
          ? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn-ghost px-4 text-sm"
            onClick={() => setDeleteConfirmOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn-danger px-4 text-sm"
            onClick={handleDelete}
            autoFocus
          >
            Delete
          </button>
        </div>
      </Modal>
    </PageShell>
  );
}
