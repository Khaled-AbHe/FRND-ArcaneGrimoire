import { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  title: string;
  pillColor?: string;
}

export function Pill({
  children,
  title,
  pillColor = "var(--accent)",
}: PillProps) {
  return (
    <div
      className="card flex w-full items-center justify-between gap-3 rounded px-3 py-2"
      style={{
        transition: "all 0.15s",
      }}
    >
      <div className="flex h-[30px] w-[40%] items-center gap-5">
        <span
          className="w-full shrink-0 text-left font-display text-sm tracking-wider"
          style={{
            color: `${pillColor}`,
          }}
        >
          {title}
        </span>
      </div>

      <div className="flex w-[50%] justify-end">{children}</div>
    </div>
  );
}
