import { ReactNode } from "react";

interface ToggleablePillProps {
  children: ReactNode;
  title: string;
  enabled: boolean;
  togglePill: () => void;
  pillColor?: string;
}

export function ToggleablePill({
  children,
  title,
  enabled,
  togglePill,
  pillColor = "var(--accent)",
}: ToggleablePillProps) {
  return (
    <button
      className="card flex w-full items-center justify-between gap-3 rounded px-3 py-2"
      style={{
        opacity: enabled ? 1 : 0.5,
        transition: "all 0.15s",
      }}
      onClick={() => togglePill()}
    >
      <div className="flex h-[30px] w-[40%] items-center gap-5">
        <span
          className="w-full shrink-0 text-left font-display text-sm tracking-wider"
          style={{
            color: enabled ? `${pillColor}` : "var(--text-muted)",
          }}
        >
          {title}
        </span>
      </div>

      <div className="flex w-[50%] justify-end">{children}</div>
    </button>
  );
}
