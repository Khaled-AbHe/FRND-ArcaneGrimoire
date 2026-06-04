import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "./Icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`card w-full ${width} animate-fade-in flex max-h-[90vh] flex-col`}
        style={{
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,191,36,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            id="modal-title"
            className="text-accent font-display text-base uppercase tracking-widest"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-dim hover:text-primary flex h-7 w-7 items-center justify-center rounded transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close dialog"
          >
            <CloseIcon size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
