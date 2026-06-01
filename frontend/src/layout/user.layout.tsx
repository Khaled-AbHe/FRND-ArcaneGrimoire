import { useSearchParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/auth/useCurrentUser";
import { UserIcon, BookIcon, SettingsIcon, SlotsIcon } from "../components/ui/Icons";
import { PageShell } from "../components/shells/page-shell.component";
import { TabId } from "../types";
import { CharactersPage } from "../pages/user/characters.page";
import { SpellManagerPage } from "../pages/user/spell-manager.page";
import { UserSettingsPage } from "../pages/user/user-settings.page";
import { Tabs } from "../components/ui/Tabs";

const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "characters", label: "My Characters", Icon: SlotsIcon },
  { id: "spells", label: "Spell Manager", Icon: BookIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

export function UserLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: currentUser } = useCurrentUser();

  const rawTab = searchParams.get("tab") as TabId | null;
  const tab: TabId =
    rawTab && ["characters", "spells", "settings"].includes(rawTab) ? rawTab : "characters";
  const setTab = (next: TabId) => setSearchParams({ tab: next }, { replace: true });

  return (
    <PageShell>
      {/* Header */}
      <header
        className="flex items-center gap-4 px-5 py-3 border-b"
        style={{ background: "var(--bg-secondary)", border: "none" }}
      >
        <h1 className="font-display text-lg text-accent tracking-widest uppercase flex-1">
          Arcane Grimoire
        </h1>

        <div className="flex items-center gap-3 pl-3">
          {currentUser && (
            <span
              className="flex items-center gap-1.5 text-xs font-display tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              <UserIcon size={12} />
              {currentUser.username}
            </span>
          )}
        </div>
      </header>

      {/* Tab bar */}
      <Tabs active={tab} tabs={TABS} onChange={setTab} />

      {/* Tab content */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {tab === "characters" && <CharactersPage />}
        {tab === "spells" && <SpellManagerPage />}
        {tab === "settings" && <UserSettingsPage />}
      </div>
    </PageShell>
  );
}
