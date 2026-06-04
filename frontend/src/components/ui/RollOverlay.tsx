import { useEffect, useRef } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export type HitRollResult = {
  kind: "hit";
  d20: number;
  bonus: number;
  total: number;
  isCrit: boolean;
  isMiss: boolean;
  mode: "normal" | "advantage" | "disadvantage";
  discarded?: number;
  id: number;
};

export type DamageRollResult = {
  kind: "damage";
  rolls: { die: string; result: number; type: string }[];
  modifier: number;
  grandTotal: number;
  id: number;
  isCrit?: boolean;
};

export type RollResult = HitRollResult | DamageRollResult;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns theme colors for a hit roll based on crit/miss state. */
function hitTheme(isCrit: boolean, isMiss: boolean) {
  if (isCrit)
    return {
      accent: "var(--crit-color)",
      border: "rgba(255, 208, 0, 0.7)",
      glow: "rgba(255, 208, 0, 0.3)",
      label: "var(--crit-color)",
    };
  if (isMiss)
    return {
      accent: "var(--miss-color)",
      border: "rgba(239, 68, 68, 0.7)",
      glow: "rgba(239, 68, 68, 0.2)",
      label: "var(--miss-color)",
    };
  return {
    accent: "var(--accent)",
    border: "rgba(0, 229, 255, 0.5)",
    glow: "rgba(0, 229, 255, 0.2)",
    label: "var(--text-muted)",
  };
}

/** Returns badge styles for advantage/disadvantage mode labels. */
function modeTheme(mode: HitRollResult["mode"]) {
  if (mode === "advantage")
    return {
      label: "ADVANTAGE",
      bg: "rgba(52, 211, 153, 0.15)",
      fg: "#34d399",
    };
  if (mode === "disadvantage")
    return {
      label: "DISADVANTAGE",
      bg: "rgba(248, 113, 113, 0.15)",
      fg: "#f87171",
    };
  return null;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function HitCard({
  result,
  onDismiss,
}: {
  result: HitRollResult;
  onDismiss: () => void;
}) {
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
    <div
      onClick={onDismiss}
      className="roll-overlay-card min-h-[250px]"
      style={{ border: `1px solid ${theme.border}` }}
    >
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
    </div>
  );
}

function DamageCard({
  result,
  onDismiss,
}: {
  result: DamageRollResult;
  onDismiss: () => void;
}) {
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
    <div
      onClick={onDismiss}
      className="roll-overlay-card mr-2 min-h-[200px]"
      style={{
        border: result.isCrit
          ? "1px solid rgba(255, 208, 0, 0.7)"
          : "1px solid rgba(0, 229, 255, 0.4)",
      }}
    >
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
    </div>
  );
}

// ── Primitive visuals ──────────────────────────────────────────────────────

/** A single die face tile, colour-coded for max/min rolls. */
function DiceFace({ value, die }: { value: number; die: string }) {
  const sides = parseInt(die.replace("d", ""), 10);
  const isMax = value === sides;
  const isMin = value === 1;

  const bg = isMax
    ? "rgba(0, 240, 56, 0.12)"
    : isMin
      ? "rgba(239, 68, 68, 0.12)"
      : "rgba(0,0,0,0.4)";
  const border = isMax
    ? "rgba(0,240,56,0.5)"
    : isMin
      ? "rgba(239,68,68,0.4)"
      : "rgba(0, 229, 255, 0.2)";
  const color = isMax
    ? "var(--hit-color)"
    : isMin
      ? "var(--miss-color)"
      : "var(--text-primary)";

  return (
    <div
      className="flex items-center justify-center rounded font-mono text-sm font-bold"
      style={{
        width: 32,
        height: 32,
        background: bg,
        border: `1px solid ${border}`,
        color,
      }}
    >
      {value}
    </div>
  );
}

/** A d20 icon with a centred value label. */
function D20Face({
  value,
  accentColor,
  glowColor,
}: {
  value: number;
  accentColor: string;
  glowColor: string;
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 100, height: 100 }}
    >
      <D20Svg color={accentColor} glow={glowColor} />
      <span
        className="absolute font-display font-bold"
        style={{
          fontSize: 32,
          color: accentColor,
          lineHeight: 1,
          textShadow: `0 0 20px ${accentColor}`,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/** Minimal d20 polygon SVG. */
function D20Svg({ color, glow }: { color: string; glow: string }) {
  const facets = [
    "50,5 95,30 50,38",
    "50,5 5,30 50,38",
    "95,30 95,70 50,62 50,38",
    "5,30 5,70 50,62 50,38",
    "95,70 50,95 50,62",
    "5,70 50,95 50,62",
  ];

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <polygon
        points="50,5 95,30 95,70 50,95 5,70 5,30"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
      />
      {facets.map((pts) => (
        <polygon
          key={pts}
          points={pts}
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

// ── Main overlay container ─────────────────────────────────────────────────

interface RollOverlayProps {
  results: RollResult[];
  onDismiss: (id: number) => void;
}

export function RollOverlay({ results, onDismiss }: RollOverlayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest card whenever results change.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  if (results.length === 0) return null;

  return (
    <div
      className="fixed flex flex-col items-center gap-2"
      style={{
        bottom: "max(26px, env(safe-area-inset-bottom, 26px))",
        right: 24,
        maxHeight: "80vh",
        overflowY: "auto",
        paddingBottom: 8,
      }}
      role="status"
      aria-live="polite"
      aria-label="Dice roll results"
    >
      {results.map((r) =>
        r.kind === "hit" ? (
          <HitCard key={r.id} result={r} onDismiss={() => onDismiss(r.id)} />
        ) : (
          <DamageCard key={r.id} result={r} onDismiss={() => onDismiss(r.id)} />
        ),
      )}
      <div ref={bottomRef} />
    </div>
  );
}
