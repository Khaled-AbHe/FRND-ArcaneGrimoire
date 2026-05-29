import { PactMagic, Spell } from "../../../types";
import { Modal } from "../../ui/Modal";
import MysticArcanumSettings from "./MysticArcanumSettings";
import PactSlotCount from "./PactSlotCount";

interface PactSettingsModalProps {
  open: boolean;
  onClose: () => void;
  pact: PactMagic;
  spells: Spell[];
  onUpdate: (pact: PactMagic) => void;
}

export function PactSettingsModal({
  open,
  onClose,
  pact,
  spells,
  onUpdate,
}: PactSettingsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Pact Magic Settings">
      <div className="space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!pact.enabled}
            onChange={(e) => onUpdate({ ...pact, enabled: e.target.checked })}
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Enable Pact Magic
          </span>
        </label>

        {pact.enabled && (
          <>
            <PactSlotCount pactMagic={pact} onUpdate={onUpdate} />
            <MysticArcanumSettings pactMagic={pact} onUpdate={onUpdate} spells={spells} />
          </>
        )}

        <button className="btn-primary w-full justify-center" onClick={onClose}>
          Done
        </button>
      </div>
    </Modal>
  );
}
