import { ReactNode } from "react";

interface SpellPresenterProps {
  isLoading: boolean;
  spellCount: number;
  filteredCount: number;
  children: ReactNode;
}

export function SpellPresenter({
  isLoading,
  spellCount,
  filteredCount,
  children,
}: SpellPresenterProps) {
  return (
    <div
      className="m-auto w-screen flex-1 overflow-y-auto p-4"
      style={{ scrollbarGutter: "stable" }}
      aria-label="Spell list"
    >
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-shimmer rounded-lg border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
                height: 130,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      ) : filteredCount === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
          {spellCount === 0 ? (
            <>
              <p className="text-accent mb-1 font-display text-sm uppercase tracking-widest">
                No Spells Yet
              </p>
              <p className="text-muted max-w-xs text-xs">
                Add spells in the Spell Manager on the main page first.
              </p>
            </>
          ) : (
            <>
              <p className="text-muted text-sm">
                No spells match your filters.
              </p>
            </>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
