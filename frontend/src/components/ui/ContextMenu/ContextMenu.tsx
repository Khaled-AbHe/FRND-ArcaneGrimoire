import { ReactNode } from "react";

interface ContextMenuProps {
  children: ReactNode;
  onClose: (e: any | null) => void;
}

export function ContextMenu({ children, onClose }: ContextMenuProps) {
  return (
    <div
      onClick={onClose}
      className="absolute left-1/2 top-full z-50 flex min-w-max -translate-x-1/2 flex-col items-center rounded border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg"
      role="menu"
    >
      {children}
    </div>
  );
}
