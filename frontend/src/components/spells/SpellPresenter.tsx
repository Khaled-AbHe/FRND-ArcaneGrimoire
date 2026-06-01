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
    <div className="flex-1 overflow-y-auto p-4" aria-label="Spell list">
      {isLoading ? (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border animate-shimmer"
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
        <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
          {spellCount === 0 ? (
            <>
              <p className="font-display text-sm tracking-widest text-accent uppercase mb-1">
                No Spells Yet
              </p>
              <p className="text-xs text-muted max-w-xs">
                Add spells in the Spell Manager on the main page first.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">No spells match your filters.</p>
            </>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
