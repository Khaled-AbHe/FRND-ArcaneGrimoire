import {
  MoonRestIcon,
  PactIcon,
  PlusIcon,
  SunRestIcon,
  TemplateIcon,
} from "../ui/Icons";

interface SlotsToolbarProps {
  setSlotSettingsOpen: (param: boolean) => void;
  setTemplateOpen: (param: boolean) => void;
  setPactOpen: (param: boolean) => void;
  doShortRest: () => void;
  doLongRest: () => void;
}

export function SlotsToolbar({
  setSlotSettingsOpen,
  setTemplateOpen,
  setPactOpen,
  doShortRest,
  doLongRest,
}: SlotsToolbarProps) {
  return (
    <div className="slots-toolbar">
      <button
        className="btn-ghost flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs"
        onClick={() => setSlotSettingsOpen(true)}
        aria-label="Edit spell slot levels"
      >
        <PlusIcon size={12} />
        Edit Slots
      </button>
      <button
        className="btn-ghost flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs"
        onClick={() => setTemplateOpen(true)}
        aria-label="Load a caster template"
      >
        <TemplateIcon size={12} />
        Load Template
      </button>
      <button
        className="btn-ghost flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs"
        onClick={() => setPactOpen(true)}
        aria-label="Configure Pact Magic"
      >
        <PactIcon size={12} />
        Pact Magic
      </button>
      <div className="flex-1" />
      <button
        className="btn-ghost flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs"
        onClick={doShortRest}
        aria-label="Take a short rest (restores pact slots)"
      >
        <MoonRestIcon size={12} />
        Short Rest
      </button>
      <button
        className="btn-primary flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs"
        onClick={doLongRest}
        aria-label="Take a long rest (restores all slots)"
      >
        <SunRestIcon size={12} />
        Long Rest
      </button>
    </div>
  );
}
