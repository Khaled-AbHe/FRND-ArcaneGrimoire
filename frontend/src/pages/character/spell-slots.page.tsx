import { useEffect, useState } from "react";
import { SlotSettingsModal } from "../../components/slots/modals/SlotSettingsModal";
import { TemplateModal } from "../../components/slots/modals/TemplateModal";
import { PactSettingsModal } from "../../components/slots/pact/PactSettingsModal";
import { SpellDetailModal } from "../../components/spells/modals/SpellDetailModal";

import type {
  DamageRollResult,
  HitRollResult,
} from "../../components/ui/RollOverlay";
import { usePreparedSpells } from "../../hooks/spells/usePreparedSpells";
import { useSpells } from "../../hooks/spells/useSpells";
import { useSpellTemplate } from "../../hooks/spells/useSpellTemplate";
import type {
  Character,
  ComputedStats,
  PactMagic,
  Spell,
  TemplateResult,
} from "../../types";
import { PageShell } from "../../components/shells/page-shell.component";
import { NoSlotsTab } from "../../components/slots/NoSlotsTab";
import { SlotsToolbar } from "../../components/slots/SlotsToolbar";
import { LevelSection } from "../../components/spells/LevelSection";

interface SpellSlotsPageProps {
  character: Character;
  stats: ComputedStats;
  onUpdateCharacter: (patch: Partial<Character>) => void;
  onRollHit: (result: HitRollResult) => void;
  onRollDamage: (result: DamageRollResult) => void;
  nextRollId: () => number;
}

export function SpellSlotsPage({
  character,
  stats,
  onUpdateCharacter,
  onRollHit,
  onRollDamage,
  nextRollId,
}: SpellSlotsPageProps) {
  const { data: spells = [] } = useSpells();
  const templateMut = useSpellTemplate();

  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);
  const [slotSettingsOpen, setSlotSettingsOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [pactOpen, setPactOpen] = useState(false);
  const [castingSpellId, setCastingSpellId] = useState<string | null>(null);

  // Close cast popover on click-outside
  useEffect(() => {
    if (castingSpellId === null) return;
    function handleClick() {
      setCastingSpellId(null);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [castingSpellId]);

  async function applyTemplate(casterType: "full" | "half" | "warlock") {
    const charLevel = character.globals?.charLevel ?? 1;
    const result: TemplateResult = await templateMut.mutateAsync({
      casterType,
      charLevel,
    });
    const patch: Partial<Character> = { levels: result.levels };
    if (result.pact) patch.pact = result.pact;
    onUpdateCharacter(patch);
    setTemplateOpen(false);
  }

  function doShortRest() {
    onUpdateCharacter({ pact: { ...character.pact, used: 0 } });
  }

  function doLongRest() {
    const levels = character.levels.map((r) => ({ ...r, used: 0 }));
    const pact = {
      ...character.pact,
      used: 0,
      arcana: (character.pact.arcana ?? []).map((a) => ({ ...a, used: false })),
    };
    onUpdateCharacter({ levels, pact });
  }

  const pact = character.pact;
  const showPact = pact?.enabled && pact.slots > 0;
  const isEmpty = character.levels.length === 0 && !showPact;

  const { preparedSet } = usePreparedSpells(
    spells,
    character,
    () => onUpdateCharacter,
  );

  return (
    <PageShell>
      {/* ── Toolbar ── */}
      <SlotsToolbar
        setSlotSettingsOpen={setSlotSettingsOpen}
        setTemplateOpen={setTemplateOpen}
        setPactOpen={setPactOpen}
        doShortRest={doShortRest}
        doLongRest={doLongRest}
      />

      {/* ── Content ── */}
      <div className="slots-content overflow-y-auto">
        {isEmpty && <NoSlotsTab />}

        {/* ── Level sections ── */}
        {!isEmpty &&
          (() => {
            const levelNums = new Set<number>(
              character.levels.map(
                (r) => parseInt(r.label.replace(/\D/g, ""), 10) || 0,
              ),
            );
            if (showPact) levelNums.add(pact.slotLevel);
            (pact?.arcana ?? []).forEach((a) => levelNums.add(a.level));
            const allLevels = Array.from(levelNums).sort((a, b) => a - b);

            return allLevels.map((levelNum) => (
              <LevelSection
                key={levelNum}
                character={character}
                showPact={showPact}
                pact={pact}
                spells={spells}
                preparedSet={preparedSet}
                stats={stats}
                levelNum={levelNum}
                onRollHit={onRollHit}
                onRollDamage={onRollDamage}
                nextRollId={nextRollId}
                setDetailSpell={setDetailSpell}
                onUpdateCharacter={onUpdateCharacter}
                castingSpellId={castingSpellId}
                setCastingSpellId={setCastingSpellId}
              />
            ));
          })()}
      </div>

      {/* ── Modals ── */}
      <SlotSettingsModal
        open={slotSettingsOpen}
        onClose={() => setSlotSettingsOpen(false)}
        levels={character.levels}
        highMagic={character.globals?.highMagic ?? false}
        onUpdate={(levels) => onUpdateCharacter({ levels })}
      />

      <TemplateModal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        charLevel={character.globals?.charLevel ?? 1}
        onApply={applyTemplate}
        isPending={templateMut.isPending}
      />

      <PactSettingsModal
        open={pactOpen}
        onClose={() => setPactOpen(false)}
        pact={character.pact}
        spells={spells}
        onUpdate={(pact: PactMagic) => onUpdateCharacter({ pact })}
      />

      <SpellDetailModal
        open={detailSpell !== null}
        onClose={() => setDetailSpell(null)}
        spell={detailSpell}
        stats={stats}
        prepared={character.prepared}
        onTogglePrepare={(id: number) => {
          const next = character.prepared.includes(id)
            ? character.prepared.filter((p) => p !== id)
            : [...character.prepared, id];
          onUpdateCharacter({ prepared: next });
        }}
      />
    </PageShell>
  );
}
