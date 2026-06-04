import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-y-hidden bg-[var(--bg-primary)]">
      {children}
    </div>
  );
}
