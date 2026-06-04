interface ContextOptionProps {
  title: string;
  color: string;
  onClick: () => void;
}

export function ContextOption({ title, color, onClick }: ContextOptionProps) {
  return (
    <button
      className={`w-full px-3 py-2 text-center text-xs transition-colors hover:bg-[var(--bg-ternary)]`}
      style={{ color: color }}
      onClick={onClick}
      role="menuitem"
    >
      {title}
    </button>
  );
}
