import { useState } from "react";
import { useCharacters } from "../../hooks/characters/useCharacters";
import { PlusIcon } from "../../components/ui/Icons";
import { CharacterFormModal } from "../../components/character/CharacterFormModal";
import CharacterCard from "../../components/character/CharacterCard";
import { PageShell } from "../../components/shells/page-shell.component";

export function CharactersPage() {
  const { data: characters = [], isLoading } = useCharacters();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <PageShell>
      <div className="mx-auto my-12 space-y-6 min-w-[40%] max-w-[80%] overflow-y-auto">
        {/* Title */}
        <div className="flex flex-row justify-between">
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
        <div className="w-full flex flex-col gap-4">
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
              <div className="text-center py-8 text-muted">
                No characters yet — create one above.
              </div>
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
    </PageShell>
  );
}
