import clsx from "clsx";
import type { TabId } from "../../types";
import { SlotsIcon, BookIcon, SettingsIcon } from "../ui/Icons";

interface TabsProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "slots", label: "Spell Slots", Icon: SlotsIcon },
  { id: "spellbook", label: "Spellbook", Icon: BookIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

export function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav
      className="flex border-b"
      role="tablist"
      aria-label="Character sections"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          className={clsx("tab-btn", active === tab.id && "active")}
          onClick={() => onChange(tab.id)}
        >
          <span className="mr-1.5 inline-flex items-center">
            <tab.Icon size={14} />
          </span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
