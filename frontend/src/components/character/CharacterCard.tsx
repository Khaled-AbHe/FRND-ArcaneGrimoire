import { useState } from "react";
import { useDeleteCharacter } from "../../hooks/characters/useDeleteCharacter";
import { useDuplicateCharacter } from "../../hooks/characters/useDuplicateCharacter";
import { Character } from "../../types";
import { DuplicateIcon, TrashIcon, CheckIcon } from "../ui/Icons";
import { useNavigate } from "react-router-dom";

interface CharacterCardProps {
  char: Character;
}

export default function CharacterCard({ char }: CharacterCardProps) {
  const navigate = useNavigate();

  const deleteChar = useDeleteCharacter();
  const duplicateChar = useDuplicateCharacter();
  const goToCharacter = (id: number) => navigate(`/character/${id}`);

  const [dupTarget, setDupTarget] = useState<Character | null>(null);
  const [dupName, setDupName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  async function handleDuplicate(e: React.FormEvent) {
    e.preventDefault();
    if (!dupTarget || !dupName.trim()) return;
    const copy = await duplicateChar.mutateAsync({
      id: dupTarget.id,
      name: dupName.trim(),
    });
    setDupTarget(null);
    setDupName("");
    goToCharacter(copy.id);
  }

  return (
    <div className="card animate-fade-in p-4">
      {dupTarget?.id === char.id ? (
        <form onSubmit={handleDuplicate} className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="New name for copy…"
            value={dupName}
            onChange={(e) => setDupName(e.target.value)}
            aria-label="Name for duplicated character"
            autoFocus
          />
          <button
            type="submit"
            className="btn-primary px-3 text-xs"
            disabled={!dupName.trim()}
            aria-label="Confirm duplicate"
          >
            Copy
          </button>
          <button
            type="button"
            className="btn-ghost px-3 text-xs"
            onClick={() => setDupTarget(null)}
            aria-label="Cancel duplicate"
          >
            Cancel
          </button>
        </form>
      ) : confirmDelete === char.id ? (
        <div className="flex items-center gap-3">
          <span
            className="flex-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Delete <strong>{char.name}</strong>?
          </span>
          <button
            className="btn-danger flex items-center gap-1.5 px-3 text-xs"
            onClick={() => {
              deleteChar.mutate(char.id);
              setConfirmDelete(null);
            }}
            aria-label={`Confirm delete ${char.name}`}
          >
            <CheckIcon size={12} />
            Delete
          </button>
          <button
            className="btn-ghost px-3 text-xs"
            onClick={() => setConfirmDelete(null)}
            aria-label="Cancel delete"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            className="flex-1 text-left"
            onClick={() => goToCharacter(char.id)}
          >
            <div className="text-accent font-display text-base tracking-wide">
              {char.name}
            </div>
            <div
              className="mt-0.5 w-[110%] text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Level {char.globals?.charLevel ?? "—"} ·{" "}
              {char.levels?.length ?? 0} spell level
              {char.levels?.length !== 1 ? "s" : ""}
            </div>
          </button>
          <button
            onClick={() => {
              setDupTarget(char);
              setDupName(char.name + " (Copy)");
            }}
            className="text-muted hover:text-dim flex h-8 w-8 items-center justify-center rounded transition-colors"
            aria-label={`Duplicate ${char.name}`}
            title="Duplicate character"
          >
            <DuplicateIcon size={15} />
          </button>
          <button
            onClick={() => setConfirmDelete(char.id)}
            className="text-muted flex h-8 w-8 items-center justify-center rounded transition-colors hover:text-red-400"
            aria-label={`Delete ${char.name}`}
            title="Delete character"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
