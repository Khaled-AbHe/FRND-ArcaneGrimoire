export function NoSlotsTab() {
  return (
    <div className="slots-empty-state">
      <p className="text-accent mb-1 font-display text-sm uppercase tracking-widest">
        No Spell Slots Yet
      </p>
      <p className="text-muted max-w-xs text-xs">
        Add individual levels with{" "}
        <strong className="text-dim">Edit Slots</strong>, or quickly load a full
        caster layout with <strong className="text-dim">Load Template</strong>.
      </p>
    </div>
  );
}
