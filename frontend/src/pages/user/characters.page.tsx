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
      <div className="mx-auto my-12 min-w-[40%] max-w-[80%] space-y-6 overflow-y-auto">
        {/* Title */}
        <div className="flex flex-row justify-between">
          <p className="text-accent mb-1 font-display text-2xl uppercase tracking-widest">
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

        <CharacterFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />

        {/* Body */}
        <div className="flex w-full flex-col gap-4">
          <div className="space-y-2">
            {/* Character list */}
            {isLoading ? (
              <>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="card animate-shimmer p-4"
                    style={{ height: 64, opacity: 0.4 }}
                  />
                ))}
              </>
            ) : characters.length === 0 ? (
              <div className="text-muted py-8 text-center">
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
