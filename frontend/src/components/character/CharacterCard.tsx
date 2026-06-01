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
    <div className="card p-4 animate-fade-in">
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
            className="btn-primary text-xs px-3"
            disabled={!dupName.trim()}
            aria-label="Confirm duplicate"
          >
            Copy
          </button>
          <button
            type="button"
            className="btn-ghost text-xs px-3"
            onClick={() => setDupTarget(null)}
            aria-label="Cancel duplicate"
          >
            Cancel
          </button>
        </form>
      ) : confirmDelete === char.id ? (
        <div className="flex items-center gap-3">
          <span className="text-sm flex-1" style={{ color: "var(--text-secondary)" }}>
            Delete <strong>{char.name}</strong>?
          </span>
          <button
            className="btn-danger text-xs px-3 flex items-center gap-1.5"
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
            className="btn-ghost text-xs px-3"
            onClick={() => setConfirmDelete(null)}
            aria-label="Cancel delete"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button className="flex-1 text-left" onClick={() => goToCharacter(char.id)}>
            <div className="font-display text-base text-accent tracking-wide">{char.name}</div>
            <div className="text-xs mt-0.5 w-[110%]" style={{ color: "var(--text-muted)" }}>
              Level {char.globals?.charLevel ?? "—"} · {char.levels?.length ?? 0} spell level
              {char.levels?.length !== 1 ? "s" : ""}
            </div>
          </button>
          <button
            onClick={() => {
              setDupTarget(char);
              setDupName(char.name + " (Copy)");
            }}
            className="w-8 h-8 flex items-center justify-center rounded text-muted hover:text-dim transition-colors"
            aria-label={`Duplicate ${char.name}`}
            title="Duplicate character"
          >
            <DuplicateIcon size={15} />
          </button>
          <button
            onClick={() => setConfirmDelete(char.id)}
            className="w-8 h-8 flex items-center justify-center rounded text-muted hover:text-red-400 transition-colors"
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
