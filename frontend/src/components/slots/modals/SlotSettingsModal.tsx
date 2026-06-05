import { useState, useEffect } from "react";
import { Modal } from "../../ui/Modal";
import type { LevelRow } from "../../../types";
import { IncrementableValue } from "../../ui/IncrementableValue";
import { levelId, levelLabel, levelNumFromRow } from "../../../utils/dice";
import { ToggleablePill } from "../../ui/ToggleablePill";

const NORMAL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const HIGH_LEVELS = [10, 11, 12] as const;

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

  function setTotal(value: number, levelNum?: number) {
    if (!levelNum) return;
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
      const next = [...levels, newRow].sort(
        (a, b) => levelNumFromRow(a) - levelNumFromRow(b),
      );
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

  return (
    <Modal open={open} onClose={onClose} title="Spell Slot Settings">
      <div className="space-y-1.5">
        {allLevels.map((levelNum) => {
          const isCantrip = levelNum === 0;
          const enabled = enabledSet.has(levelNum);
          const totalSlots = getTotal(levelNum);

          return (
            <ToggleablePill
              key={levelNum}
              title={levelLabel(levelNum)}
              enabled={enabled}
              togglePill={() => toggleLevel(levelNum, !enabled)}
            >
              {isCantrip ? (
                <span className="flex h-[30px] w-fit items-center justify-end text-sm text-[var(--text-secondary)]">
                  At Will
                </span>
              ) : (
                <div className="flex h-[30px] w-fit items-center gap-5">
                  <IncrementableValue
                    key={levelNum}
                    label={totalSlots > 1 ? "Slots" : "Slot"}
                    value={totalSlots}
                    setValue={setTotal}
                    max={4}
                    min={1}
                    disabled={!enabled}
                    mapKey={levelNum}
                  />
                </div>
              )}
            </ToggleablePill>
          );
        })}
      </div>

      <button
        className="btn-primary mt-4 w-full justify-center"
        onClick={onClose}
      >
        Done
      </button>
    </Modal>
  );
}
