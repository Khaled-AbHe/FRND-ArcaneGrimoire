import clsx from "clsx";

const SCHOOL_COLORS: Record<string, string> = {
  Abjuration: "bg-indigo-950 text-indigo-500 border-indigo-500",
  Conjuration: "bg-sky-950 text-sky-500 border-sky-500",
  Divination: "bg-yellow-950 text-yellow-500 border-yellow-500",
  Enchantment: "bg-fuchsia-950 text-fuchsia-500 border-fuchsia-500",
  Evocation: "bg-red-950 text-red-500 border-red-500",
  Illusion: "bg-purple-950 text-purple-500 border-purple-500",
  Necromancy: "bg-emerald-950 text-emerald-500 border-emerald-500",
  Transmutation: "bg-orange-950 text-orange-500 border-orange-500",
};

interface SchoolBadgeProps {
  school: string;
  className?: string;
  mini?: boolean;
}

export function SchoolBadge({ school, className, mini }: SchoolBadgeProps) {
  const colors =
    SCHOOL_COLORS[school] ?? "bg-slate-800 text-slate-300 border-slate-700";
  const text = mini ? school.slice(0, 3) : school;
  return (
    <span className={clsx("school-badge border", colors, className)}>
      {text}
    </span>
  );
}

export function ConcentrationBadge() {
  return (
    <span
      className="school-badge"
      style={{
        background: "rgba(51,65,85,0.6)",
        border: "1px solid rgba(148,163,184,0.3)",
        color: "#94a3b8",
      }}
      title="Concentration"
      aria-label="Concentration spell"
    >
      C
    </span>
  );
}

export function RitualBadge() {
  return (
    <span
      className="school-badge"
      style={{
        background: "rgba(68,44,20,0.6)",
        border: "1px solid rgba(180,130,60,0.35)",
        color: "#d4a95a",
      }}
      title="Ritual"
      aria-label="Ritual spell"
    >
      R
    </span>
  );
}
