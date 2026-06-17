import { hitTheme, modeTheme } from "../../../utils/dice";
import { HitRollResult } from "../../../types";
import { D20Face } from "../Icons";
import { RollCardShell } from "./RollCardShell";

interface HitCardProps {
  result: HitRollResult;
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

  // When both dice show the same value, keep the discarded die styled like the kept one.
  const discardedIsEqual = result.discarded === result.d20;

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

      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Roll label + mode badge */}
        {mode && (
          <span
            className="rounded px-1.5 py-0.5 font-display text-[10px] tracking-widest"
            style={{
              background: mode.bg,
              color: mode.fg,
              border: `1px solid ${mode.fg}44`,
            }}
          >
            {mode.label}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span
            className="font-display text-xs uppercase tracking-[0.2em]"
            style={{ color: theme.label }}
          >
            {rollLabel}
          </span>
        </div>

        {/* d20 face(s) */}
        <div className="flex">
          <D20Face
            value={result.d20}
            accentColor={theme.accent}
            glowColor={theme.glow}
          />

          {result.discarded !== undefined && (
            <D20Face
              value={result.discarded}
              accentColor={
                discardedIsEqual ? theme.accent : "rgb(145, 145, 145)"
              }
              glowColor={
                discardedIsEqual ? theme.glow : "rgba(145, 145, 145, 0.2)"
              }
            />
          )}
        </div>

        {/* Roll breakdown: d20 + bonus = total */}
        <div
          className="flex items-center gap-2 font-mono text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <span style={{ color: theme.accent, fontWeight: 700 }}>
            {result.d20}
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            {result.bonus >= 0 ? `+ ${result.bonus}` : result.bonus}
          </span>
          <span style={{ color: "var(--text-muted)" }}>=</span>
          <span
            style={{ color: theme.accent, fontWeight: 700, fontSize: "1.1em" }}
          >
            {result.total}
          </span>
        </div>
      </div>
    </RollCardShell>
  );
}
