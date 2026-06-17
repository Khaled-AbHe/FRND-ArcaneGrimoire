import { fmtBonus, hitTheme, modeTheme } from "../../../utils/dice";
import { HitRollResult } from "../../../types";
import { D20Face } from "../Icons";
import { RollCardShell } from "./RollCardShell";

interface HitCardProps {
  result: HitRollResult;
  theme?: {
    accent: string;
    border: string;
    glow: string;
    label: string;
  };
}

export function HitCard({ result }: HitCardProps) {
  const { isCrit, isMiss } = result;
  const theme = hitTheme(isCrit, isMiss);
  const mode = modeTheme(result.mode);
  const rollLabel = isCrit
    ? "CRITICAL HIT"
    : isMiss
      ? "CRITICAL MISS"
      : "ATTACK ROLL";

  return (
    <RollCardShell>
      {/* Radial glow pulse for crits / misses */}
      {(isCrit || isMiss) && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at center, ${isCrit ? "rgba(255,208,0,0.08)" : "rgba(239,68,68,0.08)"} 0%, transparent 70%)`,
            animation: "critPulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      <div className="flex flex-col items-center gap-3">
        {/* Roll label + mode badge */}

        <div className="flex items-center gap-2">
          <span
            className="font-display text-xs uppercase tracking-[-0.05em]"
            style={{ color: theme.label }}
          >
            {rollLabel}
            {mode && (
              <>
                {" with "}
                <span
                  className="rounded px-1.5 py-0.5 font-display text-[12px] tracking-[-0.05em]"
                  style={{
                    background: mode.bg,
                    color: mode.fg,
                    border: `1px solid ${mode.fg}44`,
                  }}
                >
                  {mode.label}
                </span>
              </>
            )}
          </span>
        </div>

        <div
          className="flex items-center gap-2 font-mono text-xl"
          style={{ color: "var(--text-secondary)" }}
        >
          <D20Display result={result} theme={theme} />

          <span className="tracking-tighter text-[var(--text-muted)]">
            {fmtBonus(result.bonus)} =
          </span>
          <span className="ml-1 font-bold" style={{ color: theme.accent }}>
            {result.total}
          </span>
        </div>
      </div>
    </RollCardShell>
  );
}

function D20Display({ result, theme }: HitCardProps) {
  if (!theme) return;

  const equalResults = result.d20s[0] === result.d20s[1];
  const highest = Math.max(...result.d20s);

  return (
    <div className="flex">
      {result.d20s.map((d20) => {
        return (
          <D20Face
            key={d20}
            value={d20}
            accentColor={
              equalResults ||
              result.mode === "normal" ||
              (result.mode === "advantage" && d20 === highest) ||
              (result.mode === "disadvantage" && d20 !== highest)
                ? theme.accent
                : "rgb(145, 145, 145)"
            }
            glowColor={
              equalResults || d20 === highest
                ? theme.glow
                : "rgba(145, 145, 145, 0.2)"
            }
          />
        );
      })}
    </div>
  );
}
