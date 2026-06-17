import { DamageRollResult } from "../../../types";
import { DiceFace } from "../Icons";
import { RollCardShell } from "./RollCardShell";

interface DamageCardProps {
  result: DamageRollResult;
}

export function DamageCard({ result }: DamageCardProps) {
  // Group rolls by damage type
  const byType = result.rolls.reduce<Record<string, typeof result.rolls>>(
    (acc, r) => {
      (acc[r.type] ??= []).push(r);
      return acc;
    },
    {},
  );

  const diceSubtotal = result.grandTotal - result.modifier;

  return (
    <RollCardShell>
      {result.isCrit && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,208,0,0.08) 0%, transparent 70%)",
            animation: "critPulse 1.5s ease-in-out infinite",
          }}
        />
      )}
      <div className="relative z-10 flex w-full flex-col items-center gap-3">
        <span
          className="font-display text-xs uppercase tracking-[0.2em]"
          style={{
            color: result.isCrit ? "var(--crit-color)" : "var(--text-muted)",
          }}
        >
          {result.isCrit ? "Critical Hit — Damage" : "Damage"}
        </span>

        {/* Dice grouped by damage type */}
        <div className="w-full space-y-2">
          {Object.entries(byType).map(([type, rolls]) => (
            <div key={type}>
              <div
                className="mb-1.5 text-center font-display uppercase tracking-widest"
                style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
              >
                {type}
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {rolls.map((r, i) => (
                  <DiceFace key={i} value={r.result} die={r.die} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total breakdown */}
        {result.rolls.length > 0 && (
          <div
            className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(0, 229, 255, 0.15)",
            }}
          >
            <div
              className="flex items-center gap-1.5 font-mono text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{diceSubtotal}</span>
              {result.modifier !== 0 && (
                <>
                  <span style={{ color: "var(--text-muted)" }}>
                    {result.modifier >= 0
                      ? `+ ${result.modifier}`
                      : result.modifier}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>=</span>
                </>
              )}
            </div>
            <span
              className="font-display font-bold"
              style={{
                fontSize: 28,
                color: "var(--accent)",
                textShadow: "0 0 16px var(--accent-glow)",
              }}
            >
              {result.grandTotal}
            </span>
          </div>
        )}
      </div>
    </RollCardShell>
  );
}
