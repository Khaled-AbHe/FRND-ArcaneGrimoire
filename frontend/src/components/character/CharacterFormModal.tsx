import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { useCreateCharacter } from "../../hooks/characters/useCreateCharacter";
import { useNavigate } from "react-router-dom";

interface CharacterFormModalProps {
  open: boolean;
  onClose: () => void;
}

interface CreateCharacterDetails {
  name: string;
  mod: number;
  prof: number;
  charLevel: number;
  highMagic: boolean;
}

const EMPTY: CreateCharacterDetails = {
  name: "Elminster Aumar",
  mod: 0,
  prof: 2,
  charLevel: 1,
  highMagic: false,
};

const DEFAULT_PACT = { enabled: false, slots: 0, slotLevel: 1, used: 0, arcana: [] };

export function CharacterFormModal({ open, onClose }: CharacterFormModalProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateCharacterDetails>(EMPTY);

  useEffect(() => {
    setForm(EMPTY);
  }, [open]);

  function set<K extends keyof CreateCharacterDetails>(key: K, value: CreateCharacterDetails[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const createChar = useCreateCharacter();
  const isPending = createChar.isPending;
  const goToCharacter = (id: number) => navigate(`/character/${id}`);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = form["name"].trim();

    if (!name) return;
    try {
      const char = await createChar.mutateAsync({
        name: name,
        globals: {
          mod: form["mod"],
          prof: form["prof"],
          charLevel: form["charLevel"],
          highMagic: false,
        },
        pact: DEFAULT_PACT,
      });
      setForm(EMPTY);
      goToCharacter(char.id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={"Create Character"} width="max-w-xl">
      <form onSubmit={handleCreate} className="space-y-5">
        {/* Name */}
        <div>
          <label className="label">Character Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={128}
            required
          />
        </div>

        {/* Character Level */}
        <div>
          <label className="label">Character Level (Used for templates)</label>
          <input
            className="input"
            type="number"
            value={form.charLevel}
            onChange={(e) => set("charLevel", Number(e.target.value) || 1)}
            min={1}
            max={20}
            required
          />
        </div>

        {/* Spellcasting Modifier */}
        <div>
          <label className="label">Spellcasting Modifier</label>
          <input
            className="input"
            type="number"
            value={form.mod}
            onChange={(e) => set("mod", Number(e.target.value) || 0)}
            min={-5}
            max={10}
            required
          />
        </div>

        {/* Proficiency Bonus */}
        <div>
          <label className="label">Proficiency Bonus</label>
          <input
            className="input"
            type="number"
            value={form.prof}
            onChange={(e) => set("prof", Number(e.target.value) || 2)}
            min={2}
            max={9}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button type="submit" className="btn-primary flex-1 justify-center" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
