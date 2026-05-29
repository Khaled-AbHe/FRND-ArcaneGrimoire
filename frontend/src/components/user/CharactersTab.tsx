import { useState } from "react";
import { useCharacters } from "../../hooks/characters/useCharacters";
import { PlusIcon } from "../ui/Icons";
import CharacterCard from "../layout/CharacterCard";
import { CharacterFormModal } from "../character/CharacterFormModal";

export default function CharactersTab() {
  const { data: characters = [], isLoading } = useCharacters();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto items-center p-10">
      {/* Title */}
      <div className="flex flex-row w-[40%] justify-between m-5">
        <p className="font-display text-2xl text-accent tracking-widest uppercase mb-1">
          My Characters
        </p>
        <button
          type="submit"
          className="btn-primary flex items-center gap-1.5"
          onClick={() => setFormOpen(true)}
        >
          <PlusIcon size={12} />
          Create
        </button>
      </div>

      <CharacterFormModal open={formOpen} onClose={() => setFormOpen(false)} />

      {/* Body */}
      <div className="w-full max-w-[40%] flex flex-col gap-4">
        <div className="space-y-2">
          {/* Character list */}
          {isLoading ? (
            <>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="card p-4 animate-shimmer"
                  style={{ height: 64, opacity: 0.4 }}
                />
              ))}
            </>
          ) : characters.length === 0 ? (
            <div className="text-center py-8 text-muted">No characters yet — create one above.</div>
          ) : (
            <>
              {characters.map((char) => (
                <CharacterCard key={char.id} char={char} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
