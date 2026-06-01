import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header";
import type { DamageRollResult, HitRollResult, RollResult } from "../components/ui/RollOverlay";
import { RollOverlay } from "../components/ui/RollOverlay";
import { useAutoSave } from "../hooks/characters/useAutoSave";
import type { Character, TabId } from "../types";
import { computeStats } from "../utils/stats";
import { useCharacter } from "../hooks/characters/useCharacter";
import { PageShell } from "../components/shells/page-shell.component";
import { SlotsIcon, BookIcon, SettingsIcon } from "../components/ui/Icons";
import { SpellSlotsPage } from "../pages/character/spell-slots.page";
import { SpellPreparerPage } from "../pages/character/spell-preparer.page";
import { CharacterSettingsPage } from "../pages/character/character-settings.page";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Tabs } from "../components/ui/Tabs";

const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: "slots", label: "Spell Slots", Icon: SlotsIcon },
  { id: "preparer", label: "Spell List", Icon: BookIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

const VALID_TABS: TabId[] = ["slots", "preparer", "settings"];

export function CharacterLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeId = id && !isNaN(Number(id)) ? Number(id) : null;

  const [rollResults, setRollResults] = useState<RollResult[]>([]);
  const rollIdCounter = useRef(0);

  const [localChar, setLocalChar] = useState<Character | undefined>(undefined);
  const { data: serverChar, isError, isLoading: charLoading } = useCharacter(activeId);
  const save = useAutoSave(activeId);

  useEffect(() => {
    if (serverChar) setLocalChar(serverChar);
  }, [serverChar]);

  const rawTab = searchParams.get("tab") as TabId | null;
  const tab: TabId = rawTab && VALID_TABS.includes(rawTab) ? rawTab : "slots";
  const setTab = (next: TabId) => setSearchParams({ tab: next }, { replace: true });

  const nextRollId = () => ++rollIdCounter.current;

  const stats = localChar
    ? computeStats(localChar)
    : { spellSaveDC: 13, charLevel: 1, attackBonus: 5, cantripTier: 1, spellMod: 1 };

  const handleUpdateCharacter = useCallback(
    (patch: Partial<Character>) => {
      if (!activeId) return;
      setLocalChar((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        if (!save) return;
        save(next);
        return next;
      });
    },
    [activeId, save],
  );

  if (!activeId) return <Navigate to="/" replace />;
  if (isError) return <Navigate to="/" replace />;
  if (charLoading || !localChar) return <LoadingSpinner />;

  function addRollResult(result: RollResult) {
    setRollResults((prev) => [...prev, result]);
  }

  function dismissRoll(id: number) {
    setRollResults((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <PageShell>
      <Header character={localChar} onBack={() => navigate("/")} />
      <Tabs active={tab} tabs={TABS} onChange={setTab} />

      <main className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {tab === "slots" && (
          <SpellSlotsPage
            character={localChar}
            stats={stats}
            onUpdateCharacter={handleUpdateCharacter}
            onRollHit={(result: HitRollResult) => addRollResult(result)}
            onRollDamage={(result: DamageRollResult) => addRollResult(result)}
            nextRollId={nextRollId}
          />
        )}
        {tab === "preparer" && (
          <SpellPreparerPage
            character={localChar}
            stats={stats}
            onUpdatePrepared={(prepared) => handleUpdateCharacter({ prepared })}
          />
        )}
        {tab === "settings" && (
          <CharacterSettingsPage
            character={localChar}
            stats={stats}
            onUpdateCharacter={handleUpdateCharacter}
          />
        )}
      </main>

      <RollOverlay results={rollResults} onDismiss={dismissRoll} />
    </PageShell>
  );
}
