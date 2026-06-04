import clsx from "clsx";
import type { TabId } from "../../types";

interface Tab {
  id: TabId;
  label: string;
  Icon: React.FC<{
    size?: number;
  }>;
}

interface TabsProps {
  active: TabId;
  tabs: Tab[];
  onChange: (tab: TabId) => void;
}

export function Tabs({ active, tabs, onChange }: TabsProps) {
  const hasBorder =
    active !== "spells" && active !== "slots" && active !== "preparer";

  return (
    <nav
      className="flex border-b"
      role="tablist"
      aria-label="Character sections"
      style={{
        background: "var(--bg-secondary)",
        borderBottom: `${hasBorder ? "1px solid" : "none"}`,
        borderColor: `${hasBorder ? "var(--border)" : "none"}`,
      }}
    >
      {tabs.map((tab) => (
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
