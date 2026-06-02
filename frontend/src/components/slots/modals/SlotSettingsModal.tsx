import { useState, useEffect } from "react";
import { Modal } from "../../ui/Modal";
import type { LevelRow } from "../../../types";

const NORMAL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const HIGH_LEVELS = [10, 11, 12] as const;

function levelId(levelNum: number) {
  return `level_${levelNum}`;
}

function levelLabel(levelNum: number) {
  return levelNum === 0 ? "Cantrip" : `Level ${levelNum}`;
}

function levelNumFromRow(row: LevelRow): number {
  return parseInt(row.label.replace(/\D/g, ""), 10) || 0;
}

interface SlotSettingsModalProps {
  open: boolean;
  onClose: () => void;
  levels: LevelRow[];
  highMagic: boolean;
  onUpdate: (levels: LevelRow[]) => void;
}

export function SlotSettingsModal({
  open,
  onClose,
  levels,
  highMagic,
  onUpdate,
}: SlotSettingsModalProps) {
  // Local draft — keyed by level number, stores the last-known total so
  // toggling off then back on restores the previous count rather than resetting to 1.
  const [totals, setTotals] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    levels.forEach((r) => {
      map[levelNumFromRow(r)] = r.total;
    });
    return map;
  });

  useEffect(() => {
    setTotals((prev) => {
      const next = { ...prev };
      levels.forEach((r) => {
        next[levelNumFromRow(r)] = r.total;
      });
      return next;
    });
  }, [levels]);

  const enabledSet = new Set(levels.map(levelNumFromRow));

  const allLevels = highMagic
    ? ([...NORMAL_LEVELS, ...HIGH_LEVELS] as number[])
    : ([...NORMAL_LEVELS] as number[]);

  function getTotal(levelNum: number): number {
    return totals[levelNum] ?? 1;
  }

  function setTotal(levelNum: number, value: number) {
    const clamped = Math.min(12, Math.max(1, value));
    setTotals((prev) => ({ ...prev, [levelNum]: clamped }));
  }

  function toggleLevel(levelNum: number, enabled: boolean) {
    if (enabled) {
      const total = getTotal(levelNum);
      const newRow: LevelRow = {
        id: levelId(levelNum),
        label: levelLabel(levelNum),
        total,
        used: 0,
      };
      const next = [...levels, newRow].sort((a, b) => levelNumFromRow(a) - levelNumFromRow(b));
      onUpdate(next);
    } else {
      // Preserve used count in totals so re-enabling restores the value
      const existing = levels.find((r) => levelNumFromRow(r) === levelNum);
      if (existing) {
        setTotals((prev) => ({ ...prev, [levelNum]: existing.total }));
      }
      onUpdate(levels.filter((r) => levelNumFromRow(r) !== levelNum));
    }
  }

  function updateTotal(levelNum: number, value: number) {
    const clamped = Math.min(12, Math.max(1, value));
    setTotals((prev) => ({ ...prev, [levelNum]: clamped }));
    const next = levels.map((r) =>
      levelNumFromRow(r) === levelNum ? { ...r, total: clamped } : r,
    );
    onUpdate(next);
  }

  return (
    <Modal open={open} onClose={onClose} title="Spell Slot Settings">
      <div className="space-y-1.5">
        {allLevels.map((levelNum) => {
          const isCantrip = levelNum === 0;
          const enabled = enabledSet.has(levelNum);

          return (
            <div
              key={levelNum}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded card"
              style={{
                opacity: enabled ? 1 : 0.5,
                transition: "all 0.15s",
              }}
            >
              <div className="flex h-[30px] w-[40%] gap-5 items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => toggleLevel(levelNum, e.target.checked)}
                  aria-label={`Enable ${levelLabel(levelNum)}`}
                />

                <span
                  className="text-sm font-display tracking-wider w-20 shrink-0"
                  style={{ color: enabled ? "var(--accent)" : "var(--text-muted)" }}
                >
                  {levelLabel(levelNum)}
                </span>
              </div>

              <div>
                {isCantrip ? (
                  <span
                    className="text-sm flex h-[30px] w-[80px] items-center justify-start"
                    style={{ color: "var(--text-muted)" }}
                  >
                    At Will
                  </span>
                ) : (
                  <div className="flex h-[30px] w-[80px] items-center justify-between">
                    <input
                      type="number"
                      className="text-sm text-right w-[30px] bg-[var(--bg-secondary)]"
                      min={1}
                      max={4}
                      disabled={!enabled}
                      value={getTotal(levelNum)}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v)) setTotal(levelNum, v);
                      }}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value, 10);
                        updateTotal(levelNum, isNaN(v) ? 1 : v);
                      }}
                      aria-label={`Slot count for ${levelLabel(levelNum)}`}
                    />
                    <span className="w-[70px] text-sm text-[var(--text-muted)]">
                      {getTotal(levelNum) > 1 ? "Slots" : "Slot"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn-primary w-full justify-center mt-4" onClick={onClose}>
        Done
      </button>
    </Modal>
  );
}
