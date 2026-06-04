import { ReactNode } from "react";

interface ContextMenuProps {
  children: ReactNode;
  onClose: (e: any | null) => void;
}

export function ContextMenu({ children, onClose }: ContextMenuProps) {
  return (
    <div
      onClick={onClose}
      className="absolute left-0 right-0 top-full z-50 mt-1 flex min-w-[120px] flex-col items-center overflow-hidden rounded border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg"
      role="menu"
    >
      {children}
    </div>
  );
}
