interface ActionButtonProps {
  onFunction: () => void;
  style: string;
  icon: JSX.Element;
}

export default function ActionButton({ onFunction, style, icon }: ActionButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onFunction();
        onEdit(spell);
      }}
      className="w-[26px] h-[26px] flex items-center justify-center rounded-md text-xs text-muted hover:bg-white/5 hover:text-dim transition-all"
      aria-label={`Edit ${spell.name}`}
      title="Edit spell"
    >
      <icon size={12} />
    </button>
  );
}
