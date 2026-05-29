import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "var(--bg-primary)" }}>
      {children}
    </div>
  );
}
