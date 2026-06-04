import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import { useSignOut } from "../../hooks/auth/useSignOut";
import { useCharacters } from "../../hooks/characters/useCharacters";
import { useCreateCharacter } from "../../hooks/characters/useCreateCharacter";
import CharacterCard from "./CharacterCard";
import { UserIcon, PlusIcon } from "../ui/Icons";

const DEFAULT_GLOBALS = { mod: 3, prof: 2, charLevel: 1, highMagic: false };
const DEFAULT_PACT = {
  enabled: false,
  slots: 0,
  slotLevel: 1,
  used: 0,
  arcana: [],
};

export function CharacterSelect() {
  const navigate = useNavigate();
  const { data: characters = [], isLoading } = useCharacters();
  const createChar = useCreateCharacter();
  const { data: currentUser } = useCurrentUser();
  const signOut = useSignOut();

  const [newName, setNewName] = useState("");

  const goToCharacter = (id: number) => navigate(`/character/${id}`);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const char = await createChar.mutateAsync({
      name: newName.trim(),
      globals: DEFAULT_GLOBALS,
      pact: DEFAULT_PACT,
    });
    setNewName("");
    goToCharacter(char.id);
  }

  async function handleSignOut() {
    await signOut.mutateAsync();
    navigate("/signin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      {/* Top-right user bar */}
      <div className="fixed right-5 top-4 flex items-center gap-3">
        {currentUser && (
          <span
            className="flex items-center gap-1.5 font-display text-xs tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            <UserIcon size={12} />
            {currentUser.username}
          </span>
        )}
        <button
          onClick={handleSignOut}
          disabled={signOut.isPending}
          className="btn-ghost px-3 py-1 text-xs"
          aria-label="Sign out of your account"
        >
          {signOut.isPending ? "…" : "Sign Out"}
        </button>
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="text-accent mb-2 font-display text-4xl uppercase tracking-widest">
          Spell Slot Manager
        </h1>
        <p className="text-dim text-lg">D&D Spell Tracker</p>
      </div>

      <div className="w-full max-w-lg space-y-4">
        {/* Create new */}
        <form onSubmit={handleCreate} className="card p-4">
          <div className="label mb-2">New Character</div>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Character name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={64}
              aria-label="New character name"
            />
            <button
              type="submit"
              className="btn-primary flex items-center gap-1.5"
              disabled={!newName.trim() || createChar.isPending}
              aria-label="Create new character"
            >
              <PlusIcon size={12} />
              Create
            </button>
          </div>
        </form>

        {/* Character list */}
        {isLoading ? (
          /* Skeleton cards */
          <div
            className="space-y-2"
            aria-busy="true"
            aria-label="Loading characters"
          >
            {[1, 2].map((i) => (
              <div
                key={i}
                className="card animate-shimmer p-4"
                style={{ height: 64, opacity: 0.4 }}
              />
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="text-muted py-8 text-center">
            No characters yet — create one above.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="label m-auto w-[81%] px-1">Characters</div>
            {characters.map((char) => (
              <CharacterCard key={char.id} char={char} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
