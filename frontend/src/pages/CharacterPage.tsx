import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Tabs } from "../components/layout/Tabs";
import { SettingsTab } from "../components/settings/SettingsTab";
import { SlotsTab } from "../components/slots/SlotsTab";
import { SpellsTab } from "../components/spells/SpellsTab";
import type { DamageRollResult, HitRollResult, RollResult } from "../components/ui/RollOverlay";
import { RollOverlay } from "../components/ui/RollOverlay";
import { useAutoSave } from "../hooks/characters/useAutoSave";
import type { Character, TabId } from "../types";
import { computeStats } from "../utils/stats";
import { useCharacter } from "../hooks/characters/useCharacter";
import { LoadingSpinner } from "../components/layout/LoadingSpinner";
import PageShell from "../components/shells/page-shell.component";

const VALID_TABS: TabId[] = ["slots", "spellbook", "settings"];

export function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeId = id && !isNaN(Number(id)) ? Number(id) : null;

  // ── Roll overlay state ────────────────────────────────────────────────────
  const [rollResults, setRollResults] = useState<RollResult[]>([]);
  const rollIdCounter = useRef(0);

  // ── Character state ───────────────────────────────────────────────────────
  const [localChar, setLocalChar] = useState<Character | undefined>(undefined);
  const { data: serverChar, isError, isLoading: charLoading } = useCharacter(activeId);
  const save = useAutoSave(activeId);

  // Sync server data into local state whenever it arrives or the character changes
  useEffect(() => {
    if (serverChar) setLocalChar(serverChar);
  }, [serverChar]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const rawTab = searchParams.get("tab") as TabId | null;
  const tab: TabId = rawTab && VALID_TABS.includes(rawTab) ? rawTab : "slots";
  const setTab = (next: TabId) => setSearchParams({ tab: next }, { replace: true });

  const nextRollId = () => ++rollIdCounter.current;

  const stats = localChar
    ? computeStats(localChar)
    : { spellSaveDC: 13, charLevel: 1, attackBonus: 5, cantripTier: 1, spellMod: 1 };

  // ── Instant local update + debounced save ─────────────────────────────────
  const handleUpdateCharacter = useCallback(
    (patch: Partial<Character>) => {
      if (!activeId) return;
      setLocalChar((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        save(next);
        return next;
      });
    },
    [activeId, save],
  );

  // ── Early returns — all hooks are above this line ─────────────────────────
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
      <Header
        character={localChar}
        onBack={() => navigate("/")}
        onRename={(name) => handleUpdateCharacter({ name })}
      />
      <Tabs active={tab} onChange={setTab} />

      <main className="flex-1 overflow-hidden flex flex-col">
        {tab === "slots" && (
          <SlotsTab
            character={localChar}
            stats={stats}
            onUpdateCharacter={handleUpdateCharacter}
            onRollHit={(result: HitRollResult) => addRollResult(result)}
            onRollDamage={(result: DamageRollResult) => addRollResult(result)}
            nextRollId={nextRollId}
          />
        )}
        {tab === "spellbook" && (
          <SpellsTab
            character={localChar}
            stats={stats}
            onUpdatePrepared={(prepared) => handleUpdateCharacter({ prepared })}
            onUpdateCharacter={handleUpdateCharacter}
          />
        )}
        {tab === "settings" && (
          <SettingsTab
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
