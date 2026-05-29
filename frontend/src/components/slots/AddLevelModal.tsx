import { useState } from "react";
import { Modal } from "../ui/Modal";

interface AddLevelModalProps {
  open: boolean;
  onClose: () => void;
  existingLabels: string[];
  onAdd: (levelNum: number, total: number) => void;
}

export function AddLevelModal({ open, onClose, onAdd }: AddLevelModalProps) {
  const [levelNum, setLevelNum] = useState(1);
  const [total, setTotal] = useState(2);

  function handleAdd() {
    onAdd(levelNum, total);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Spell Level">
      <div className="space-y-4">
        <div>
          <label className="label">Spell Level (0 = Cantrip)</label>
          <input
            type="number"
            className="input"
            min={0}
            max={12}
            value={levelNum}
            onChange={(e) => setLevelNum(+e.target.value)}
          />
        </div>
        {levelNum > 0 && (
          <div>
            <label className="label">Total Slots</label>
            <input
              type="number"
              className="input"
              min={1}
              max={12}
              value={total}
              onChange={(e) => setTotal(+e.target.value)}
            />
          </div>
        )}
        <div className="flex gap-3">
          <button className="btn-primary flex-1 justify-center" onClick={handleAdd}>
            Add
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
