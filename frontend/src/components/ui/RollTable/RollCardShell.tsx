import { ReactNode } from "react";

interface RollCardShellProps {
  children: ReactNode;
}

export function RollCardShell({ children }: RollCardShellProps) {
  return (
    <div className="roll-overlay-card m-5 h-[250px] min-h-[250px] w-full border border-[var(--border)]">
      {children}
    </div>
  );
}
