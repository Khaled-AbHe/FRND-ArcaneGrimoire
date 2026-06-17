import { ReactNode } from "react";

interface RollCardShellProps {
  children: ReactNode;
}

export function RollCardShell({ children }: RollCardShellProps) {
  return (
    <div className="roll-overlay-card my-2 h-[250px] min-h-fit border border-[var(--border)]">
      {children}
    </div>
  );
}
