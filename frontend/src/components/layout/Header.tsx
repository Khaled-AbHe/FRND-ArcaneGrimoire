import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import { useSignOut } from "../../hooks/auth/useSignOut";
import type { Character } from "../../types";
import { ArrowLeftIcon, PencilIcon, UserIcon } from "../ui/Icons";

interface HeaderProps {
  character: Character;
  onBack: () => void;
  onRename: (name: string) => void;
}

export function Header({ character, onBack, onRename }: HeaderProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(character.name);
  const { data: currentUser } = useCurrentUser();
  const signOut = useSignOut();
  const navigate = useNavigate();

  function saveName() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === character.name) {
      setEditing(false);
      return;
    }
    onRename(trimmed);
    setEditing(false);
  }

  async function handleSignOut() {
    await signOut.mutateAsync();
    navigate("/signin");
  }

  return (
    <header
      className="flex items-center gap-4 px-5 py-3 border-b"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
    >
      <button
        onClick={onBack}
        className="w-8 h-8 flex items-center justify-center rounded transition-colors text-muted hover:text-accent"
        aria-label="Back to character select"
        title="Back to character select"
      >
        <ArrowLeftIcon size={18} />
      </button>

      <div className="flex-1 flex items-center gap-2">
        {editing ? (
          <input
            className="input text-base font-display"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName();
              if (e.key === "Escape") {
                setEditing(false);
                setName(character.name);
              }
            }}
            autoFocus
            maxLength={64}
            aria-label="Character name"
            style={{ maxWidth: 260 }}
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 group"
            aria-label={`Rename character: ${character.name}`}
            title="Click to rename"
          >
            <h1 className="font-display text-lg text-accent tracking-widest uppercase">
              {character.name}
            </h1>
            <span className="opacity-0 group-hover:opacity-60 transition-opacity text-muted">
              <PencilIcon size={13} />
            </span>
          </button>
        )}
      </div>

      <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
        Lv {character.globals?.charLevel ?? 1}
      </div>

      <div
        className="flex items-center gap-3 pl-3"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        {currentUser && (
          <span
            className="flex items-center gap-1.5 text-xs font-display tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            <UserIcon size={12} />
            {currentUser.username}
          </span>
        )}
        <button
          onClick={handleSignOut}
          disabled={signOut.isPending}
          className="btn-ghost text-xs px-3 py-1"
          aria-label="Sign out of your account"
        >
          {signOut.isPending ? "…" : "Sign Out"}
        </button>
      </div>
    </header>
  );
}
