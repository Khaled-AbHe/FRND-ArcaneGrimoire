import { Modal } from "../ui/Modal";

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  charLevel: number;
  onApply: (casterType: "full" | "half" | "warlock") => Promise<void>;
  isPending: boolean;
}

export function TemplateModal({
  open,
  onClose,
  charLevel,
  onApply,
  isPending,
}: TemplateModalProps) {
  function handleApply(type: "full" | "half" | "warlock") {
    onApply(type);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Load Class Template">
      <div className="space-y-3">
        <p className="text-sm text-dim">
          Load slots for character level <strong className="text-accent">{charLevel}</strong>. This
          will replace your current level rows.
        </p>
        {(["full", "half", "warlock"] as const).map((type) => (
          <button
            key={type}
            className="btn-ghost w-full justify-between"
            onClick={() => handleApply(type)}
            disabled={isPending}
          >
            <span className="capitalize">
              {type === "full"
                ? "Full Caster"
                : type === "half"
                  ? "Half Caster"
                  : "Warlock (Pact Magic)"}
            </span>
            <span className="text-xs text-muted">
              {type === "full"
                ? "Wizard, Sorcerer, Cleric…"
                : type === "half"
                  ? "Paladin, Ranger…"
                  : "Pact slots + Arcanum"}
            </span>
          </button>
        ))}
        <button className="btn-ghost w-full justify-center" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
