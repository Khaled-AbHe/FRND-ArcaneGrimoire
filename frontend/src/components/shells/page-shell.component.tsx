import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--bg-primary)] overflow-y-hidden">
      {children}
    </div>
  );
}
