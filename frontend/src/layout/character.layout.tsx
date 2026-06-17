import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import { Header } from "../components/layout/Header";
import { PageShell } from "../components/shells/page-shell.component";
import { BookIcon, SettingsIcon, SlotsIcon } from "../components/ui/Icons";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Tabs } from "../components/ui/Tabs";
import { useAutoSave } from "../hooks/characters/useAutoSave";
import { useCharacter } from "../hooks/characters/useCharacter";
import { CharacterSettingsPage } from "../pages/character/character-settings.page";
import { SpellPreparerPage } from "../pages/character/spell-preparer.page";
import { SpellSlotsPage } from "../pages/character/spell-slots.page";
import type {
  Character,
  DamageRollResult,
  HitRollResult,
  RollResult,
  TabId,
} from "../types";
import { computeStats } from "../utils/stats";

const TABS: { id: TabId; label: string; Icon: React.FC<{ size?: number }> }[] =
  [
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

  // @ts-expect-error
  const [rolls, setRolls] = useSessionStorage<RollResult[]>("result-logs", []);

  function addRollResult(result: RollResult) {
    setRolls((prevRolls) => {
      // Generate the ID contextually based on what is actually in the session
      const nextId =
        prevRolls.length > 0
          ? Math.max(...prevRolls.map((r) => r.id ?? 0)) + 1
          : 1;

      return [...prevRolls, { ...result, id: nextId }];
    });
  }

  const [localChar, setLocalChar] = useState<Character | undefined>(undefined);
  const {
    data: serverChar,
    isError,
    isLoading: charLoading,
  } = useCharacter(activeId);
  const save = useAutoSave(activeId);

  useEffect(() => {
    if (serverChar) setLocalChar(serverChar);
  }, [serverChar]);

  const rawTab = searchParams.get("tab") as TabId | null;
  const tab: TabId = rawTab && VALID_TABS.includes(rawTab) ? rawTab : "slots";
  const setTab = (next: TabId) =>
    setSearchParams({ tab: next }, { replace: true });

  const stats = localChar
    ? computeStats(localChar)
    : {
        spellSaveDC: 13,
        charLevel: 1,
        attackBonus: 5,
        cantripTier: 1,
        spellMod: 1,
      };

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

  return (
    <PageShell>
      <Header character={localChar} onBack={() => navigate("/grimoire")} />
      <Tabs active={tab} tabs={TABS} onChange={setTab} />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {tab === "slots" && (
          <SpellSlotsPage
            character={localChar}
            stats={stats}
            onUpdateCharacter={handleUpdateCharacter}
            onRollHit={(result: HitRollResult) => addRollResult(result)}
            onRollDamage={(result: DamageRollResult) => addRollResult(result)}
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
    </PageShell>
  );
}
