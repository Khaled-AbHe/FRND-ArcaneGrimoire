import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import type { Character } from "../../types";
import { ArrowLeftIcon, UserIcon } from "../ui/Icons";

interface HeaderProps {
  character: Character;
  onBack: () => void;
}

export function Header({ character, onBack }: HeaderProps) {
  const { data: currentUser } = useCurrentUser();

  return (
    <header
      className="flex items-center gap-4 px-5 py-3 border-b"
      style={{ background: "var(--bg-secondary)", border: "none" }}
    >
      <button
        onClick={onBack}
        className="w-8 h-8 flex items-center justify-center rounded transition-colors text-muted hover:text-accent"
        aria-label="Back to character select"
        title="Back to character select"
      >
        <ArrowLeftIcon size={18} />
      </button>

      <div className="flex-1 items-center gap-2">
        <h1 className="font-display text-lg text-accent tracking-widest uppercase">
          {character.name}
        </h1>
      </div>

      <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
        LvL {character.globals?.charLevel ?? 1}
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
      </div>
    </header>
  );
}
