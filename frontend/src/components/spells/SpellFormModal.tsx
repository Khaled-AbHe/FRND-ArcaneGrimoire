import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import type {
  Spell,
  CreateSpellDto,
  SpellLevel,
  DiceEntry,
  UpcastEntry,
  ScalingThreshold,
  SpellComponents,
  SpellType,
  OutputTypeShape,
} from "../../types";
import {
  SCHOOLS,
  ABILITIES,
  SPELL_LEVELS,
  DIE_TYPES,
  OUTPUT_TYPES,
  ATTACK_TYPES,
} from "../../types";
import { useCreateSpell } from "../../hooks/spells/useCreateSpell";
import { useUpdateSpell } from "../../hooks/spells/useUpdateSpell";

interface SpellFormModalProps {
  open: boolean;
  onClose: () => void;
  editing?: Spell | null;
}

const EMPTY: CreateSpellDto = {
  name: "",
  level: "1",
  school: "Evocation",
  castTime: "Action",
  range: "60 feet",
  duration: "Instantaneous",
  concentration: false,
  ritual: false,
  components: { verbal: true, somatic: true },
  spellType: { kind: "utility" },
  outputType: { kind: "leveled", dice: [] },
  notes: null,
};

export function SpellFormModal({ open, onClose, editing }: SpellFormModalProps) {
  const createSpell = useCreateSpell();
  const updateSpell = useUpdateSpell();

  const [form, setForm] = useState<CreateSpellDto>(EMPTY);

  useEffect(() => {
    if (editing) {
      const { id: _id, createdAt: _c, updatedAt: _u, ...dto } = editing;
      setForm(dto);
    } else {
      setForm(EMPTY);
    }
  }, [editing, open]);

  function set<K extends keyof CreateSpellDto>(key: K, value: CreateSpellDto[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const isCantrip = form.level === "cantrip";
  const spellLevel = isCantrip ? 1 : +(form.level ?? 1);
  const st = form.spellType;
  const out = form.outputType;
  const isPending = createSpell.isPending || updateSpell.isPending;

  // ── spellType helpers ──────────────────────────────────────────────────────
  function setSpellTypeKind(kind: SpellType["kind"]) {
    if (kind === "attack") set("spellType", { kind: "attack", attackType: "Ranged Spell Attack" });
    else if (kind === "save") set("spellType", { kind: "save", saveAbility: "Dexterity" });
    else set("spellType", { kind: "utility" });
  }

  // ── components helpers ─────────────────────────────────────────────────────
  function setComp<K extends keyof SpellComponents>(key: K, value: SpellComponents[K]) {
    set("components", { ...form.components, [key]: value });
  }

  // ── outputType kind switching ──────────────────────────────────────────────
  function setOutputKind(kind: OutputTypeShape["kind"]) {
    if (kind === "leveled") set("outputType", { kind: "leveled", dice: [] });
    else if (kind === "cantrip")
      set("outputType", {
        kind: "cantrip",
        dice: [{ count: 1, die: "d6", type: "Fire" }],
        scaling: [],
      });
    else set("outputType", { kind: "utility" });
  }

  // ── leveled dice helpers ───────────────────────────────────────────────────
  function addDie() {
    if (out.kind !== "leveled") return;
    set("outputType", { ...out, dice: [...out.dice, { count: 1, die: "d6", type: "Fire" }] });
  }
  function updateDie(i: number, patch: Partial<DiceEntry>) {
    if (out.kind !== "leveled") return;
    const arr = [...out.dice];
    arr[i] = { ...arr[i], ...patch };
    set("outputType", { ...out, dice: arr });
  }
  function removeDie(i: number) {
    if (out.kind !== "leveled") return;
    set("outputType", { ...out, dice: out.dice.filter((_, j) => j !== i) });
  }

  // ── upcast helpers ─────────────────────────────────────────────────────────
  function addUpcast() {
    if (out.kind !== "leveled") return;
    const existing = out.upcast?.dice ?? [];
    set("outputType", {
      ...out,
      upcast: {
        dice: [
          ...existing,
          { count: 1, die: "d6", type: "Fire", everyNLevels: 1, aboveLevel: spellLevel },
        ],
      },
    });
  }
  function updateUpcast(i: number, patch: Partial<UpcastEntry>) {
    if (out.kind !== "leveled" || !out.upcast) return;
    const arr = [...out.upcast.dice];
    arr[i] = { ...arr[i], ...patch };
    set("outputType", { ...out, upcast: { dice: arr } });
  }
  function removeUpcast(i: number) {
    if (out.kind !== "leveled" || !out.upcast) return;
    const arr = out.upcast.dice.filter((_, j) => j !== i);
    set("outputType", { ...out, upcast: arr.length ? { dice: arr } : undefined });
  }

  // ── projectile helpers ─────────────────────────────────────────────────────
  function toggleProjectiles(enabled: boolean) {
    if (out.kind !== "leveled") return;
    set(
      "outputType",
      enabled ? { ...out, projectiles: { baseCount: 1 } } : { ...out, projectiles: undefined },
    );
  }
  function setProjectileBase(n: number) {
    if (out.kind !== "leveled" || !out.projectiles) return;
    set("outputType", { ...out, projectiles: { ...out.projectiles, baseCount: n } });
  }
  function toggleProjectileUpcast(enabled: boolean) {
    if (out.kind !== "leveled" || !out.projectiles) return;
    set("outputType", {
      ...out,
      projectiles: enabled
        ? { ...out.projectiles, upcast: { count: 1, everyNLevels: 1, aboveLevel: spellLevel } }
        : { ...out.projectiles, upcast: undefined },
    });
  }

  // ── cantrip dice helpers ───────────────────────────────────────────────────
  function updateCantripDie(patch: Partial<DiceEntry>) {
    if (out.kind !== "cantrip") return;
    set("outputType", { ...out, dice: [{ ...out.dice[0], ...patch }] });
  }
  function addScalingTier() {
    if (out.kind !== "cantrip") return;
    set("outputType", { ...out, scaling: [...out.scaling, { characterLevel: 5, diceCount: 2 }] });
  }
  function updateScalingTier(i: number, patch: Partial<ScalingThreshold>) {
    if (out.kind !== "cantrip") return;
    const arr = [...out.scaling] as ScalingThreshold[];
    arr[i] = { ...arr[i], ...patch } as ScalingThreshold;
    set("outputType", { ...out, scaling: arr });
  }
  function removeScalingTier(i: number) {
    if (out.kind !== "cantrip") return;
    set("outputType", { ...out, scaling: out.scaling.filter((_, j) => j !== i) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      await updateSpell.mutateAsync({ id: editing.id, dto: form });
    } else {
      await createSpell.mutateAsync(form);
    }
    onClose();
  }

  // ── cantrip die (first entry) ──────────────────────────────────────────────
  const cantripDie = out.kind === "cantrip" ? out.dice[0] : null;
  const cantripScaling = out.kind === "cantrip" ? out.scaling : [];
  const leveledDice = out.kind === "leveled" ? out.dice : [];
  const upcastDice = out.kind === "leveled" ? (out.upcast?.dice ?? []) : [];
  const projectiles = out.kind === "leveled" ? out.projectiles : undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `Edit ${form.name}` : "Add Spell"}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="label">Spell Name *</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={128}
            required
          />
        </div>

        {/* Level + School */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Level</label>
            <select
              className="select"
              value={form.level}
              onChange={(e) => set("level", e.target.value as SpellLevel)}
            >
              {SPELL_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l === "cantrip" ? "Cantrip" : `Level ${l}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">School</label>
            <select
              className="select"
              value={form.school ?? ""}
              onChange={(e) => set("school", e.target.value as any)}
            >
              {SCHOOLS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cast Time + Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Casting Time</label>
            <input
              className="input"
              value={form.castTime ?? ""}
              onChange={(e) => set("castTime", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Range</label>
            <input
              className="input"
              value={form.range ?? ""}
              onChange={(e) => set("range", e.target.value)}
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="label">Duration</label>
          <input
            className="input"
            value={form.duration ?? ""}
            onChange={(e) => set("duration", e.target.value)}
          />
        </div>

        {/* Components */}
        <div>
          <label className="label">Components</label>
          <div className="flex gap-4 mb-2">
            {(["verbal", "somatic"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.components[k]}
                  onChange={(e) => setComp(k, e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {k === "verbal" ? "V — Verbal" : "S — Somatic"}
                </span>
              </label>
            ))}
          </div>
          <div>
            <label className="label">Material (leave blank if none)</label>
            <input
              className="input"
              placeholder="e.g. a ball of bat guano and sulfur"
              value={form.components.material ?? ""}
              onChange={(e) => setComp("material", e.target.value || undefined)}
            />
          </div>
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          {[
            { key: "concentration" as const, label: "Concentration" },
            { key: "ritual" as const, label: "Ritual" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {label}
              </span>
            </label>
          ))}
        </div>

        {/* Spell Type */}
        <div>
          <label className="label">Spell Type</label>
          <div className="flex gap-2">
            {(["utility", "attack", "save"] as SpellType["kind"][]).map((k) => (
              <button
                key={k}
                type="button"
                className={
                  st.kind === k
                    ? "btn-primary text-xs px-3 py-1.5"
                    : "btn-ghost text-xs px-3 py-1.5"
                }
                onClick={() => setSpellTypeKind(k)}
              >
                {k === "utility" ? "Utility" : k === "attack" ? "Attack Roll" : "Saving Throw"}
              </button>
            ))}
          </div>

          {st.kind === "save" && (
            <div className="mt-3">
              <label className="label">Save Ability</label>
              <select
                className="select"
                value={st.saveAbility}
                onChange={(e) =>
                  set("spellType", { kind: "save", saveAbility: e.target.value as any })
                }
              >
                {ABILITIES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          )}

          {st.kind === "attack" && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="label">Attack Type</label>
                <select
                  className="select"
                  value={st.attackType}
                  onChange={(e) => set("spellType", { ...st, attackType: e.target.value as any })}
                >
                  {ATTACK_TYPES.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Crit Range (default 20)</label>
                <input
                  type="number"
                  className="input"
                  min={2}
                  max={20}
                  value={st.critRange ?? 20}
                  onChange={(e) =>
                    set("spellType", {
                      ...st,
                      critRange: +e.target.value === 20 ? undefined : +e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Output Type */}
        <div>
          <label className="label">Output Type</label>
          <div className="flex gap-2 mb-3">
            {(["leveled", "cantrip", "utility"] as OutputTypeShape["kind"][]).map((k) => (
              <button
                key={k}
                type="button"
                className={
                  out.kind === k
                    ? "btn-primary text-xs px-3 py-1.5"
                    : "btn-ghost text-xs px-3 py-1.5"
                }
                onClick={() => setOutputKind(k)}
              >
                {k === "leveled" ? "Leveled" : k === "cantrip" ? "Cantrip" : "Utility (no dice)"}
              </button>
            ))}
          </div>

          {/* ── Cantrip output ── */}
          {out.kind === "cantrip" && (
            <div
              className="space-y-3 rounded-lg p-3 border"
              style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Die</label>
                  <select
                    className="select"
                    value={cantripDie?.die ?? "d6"}
                    onChange={(e) => updateCantripDie({ die: e.target.value as any })}
                  >
                    {DIE_TYPES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Damage Type</label>
                  <select
                    className="select"
                    value={cantripDie?.type ?? "Fire"}
                    onChange={(e) => updateCantripDie({ type: e.target.value as any })}
                  >
                    {OUTPUT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!cantripDie?.addCastingMod}
                      onChange={(e) => updateCantripDie({ addCastingMod: e.target.checked })}
                    />
                    <span className="text-sm text-dim">+ Casting Mod</span>
                  </label>
                </div>
              </div>

              {/* Scaling tiers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label">Scaling Tiers</label>
                  <button
                    type="button"
                    className="btn-ghost text-xs px-2 py-1"
                    onClick={addScalingTier}
                  >
                    + Tier
                  </button>
                </div>
                {cantripScaling.map((tier, i) => (
                  <div key={i} className="flex gap-2 mb-1.5">
                    <div className="flex-1">
                      <label className="label">At Char Level</label>
                      <input
                        type="number"
                        className="input"
                        value={tier.characterLevel}
                        min={1}
                        max={20}
                        onChange={(e) => updateScalingTier(i, { characterLevel: +e.target.value })}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="label">
                        {tier.projCount != null ? "Projectile Count" : "Dice Count"}
                      </label>
                      <input
                        type="number"
                        className="input"
                        value={tier.diceCount ?? tier.projCount ?? 1}
                        min={1}
                        onChange={(e) => {
                          const val = +e.target.value;
                          updateScalingTier(
                            i,
                            tier.projCount != null ? { projCount: val } : { diceCount: val },
                          );
                        }}
                      />
                    </div>
                    <div className="flex items-end pb-0.5">
                      <label
                        className="flex items-center gap-1 text-xs cursor-pointer"
                        title="Switch between scaling dice count vs projectile count"
                      >
                        <input
                          type="checkbox"
                          checked={tier.projCount != null}
                          onChange={(e) => {
                            const val = tier.diceCount ?? tier.projCount ?? 1;
                            updateScalingTier(
                              i,
                              e.target.checked
                                ? { projCount: val, diceCount: undefined }
                                : { diceCount: val, projCount: undefined },
                            );
                          }}
                        />
                        <span className="text-dim">Proj</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      className="self-end mb-0.5 w-8 h-9 flex items-center justify-center text-red-400 hover:text-red-300"
                      onClick={() => removeScalingTier(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Leveled output ── */}
          {out.kind === "leveled" && (
            <div className="space-y-4">
              {/* Base dice */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="label">Base Damage Dice</label>
                  <button type="button" className="btn-ghost text-xs px-2 py-1" onClick={addDie}>
                    + Die Row
                  </button>
                </div>
                {leveledDice.map((d, i) => (
                  <div
                    key={i}
                    className="grid items-end gap-2 rounded p-2"
                    style={{
                      background: "var(--bg-raised)",
                      gridTemplateColumns: "72px 96px 1fr 72px 52px 28px",
                    }}
                  >
                    <div>
                      <label className="label">Count</label>
                      <input
                        type="number"
                        className="input"
                        min={1}
                        value={d.count}
                        onChange={(e) => updateDie(i, { count: +e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Die</label>
                      <select
                        className="select"
                        value={d.die}
                        onChange={(e) => updateDie(i, { die: e.target.value as any })}
                      >
                        <option value="d0">d0 (none)</option>
                        {DIE_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Type</label>
                      <select
                        className="select"
                        value={d.type}
                        onChange={(e) => updateDie(i, { type: e.target.value as any })}
                      >
                        {OUTPUT_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">+Flat</label>
                      <input
                        type="number"
                        className="input"
                        value={d.flatBonus ?? 0}
                        onChange={(e) => updateDie(i, { flatBonus: +e.target.value || undefined })}
                      />
                    </div>
                    <label className="flex flex-col items-center gap-1 cursor-pointer">
                      <span className="label">+Mod</span>
                      <input
                        type="checkbox"
                        className="w-4 h-4 mt-1"
                        checked={!!d.addCastingMod}
                        onChange={(e) => updateDie(i, { addCastingMod: e.target.checked })}
                      />
                    </label>
                    <button
                      type="button"
                      className="self-end pb-1.5 text-red-400 hover:text-red-300 text-center"
                      onClick={() => removeDie(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Upcast dice */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="label">Upcast Dice</label>
                  <button type="button" className="btn-ghost text-xs px-2 py-1" onClick={addUpcast}>
                    + Upcast Row
                  </button>
                </div>
                {upcastDice.map((u, i) => (
                  <div
                    key={i}
                    className="grid gap-2 items-end rounded p-2"
                    style={{
                      background: "var(--bg-raised)",
                      gridTemplateColumns: "repeat(6, 1fr)",
                    }}
                  >
                    <div>
                      <label className="label">Count</label>
                      <input
                        type="number"
                        className="input"
                        min={0}
                        value={u.count}
                        onChange={(e) => updateUpcast(i, { count: +e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Die</label>
                      <select
                        className="select"
                        value={u.die}
                        onChange={(e) => updateUpcast(i, { die: e.target.value as any })}
                      >
                        <option value="d0">d0 (none)</option>
                        {DIE_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Every N Lvls</label>
                      <input
                        type="number"
                        className="input"
                        min={1}
                        value={u.everyNLevels}
                        onChange={(e) => updateUpcast(i, { everyNLevels: +e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Above Lvl</label>
                      <input
                        type="number"
                        className="input"
                        min={spellLevel}
                        max={12}
                        value={u.aboveLevel}
                        onChange={(e) => updateUpcast(i, { aboveLevel: +e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">+Flat/step</label>
                      <input
                        type="number"
                        className="input"
                        value={u.flatBonus ?? 0}
                        onChange={(e) =>
                          updateUpcast(i, { flatBonus: +e.target.value || undefined })
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="label">Type</label>
                        <select
                          className="select"
                          value={u.type}
                          onChange={(e) => updateUpcast(i, { type: e.target.value as any })}
                        >
                          {OUTPUT_TYPES.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        className="pb-1 text-red-400 w-6"
                        onClick={() => removeUpcast(i)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projectiles */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!projectiles}
                    onChange={(e) => toggleProjectiles(e.target.checked)}
                  />
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Multi-projectile spell (Magic Missile, Scorching Ray…)
                  </span>
                </label>
                {projectiles && (
                  <div className="pl-5 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Base Projectiles</label>
                        <input
                          type="number"
                          className="input"
                          min={1}
                          value={projectiles.baseCount}
                          onChange={(e) => setProjectileBase(+e.target.value)}
                        />
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!projectiles.upcast}
                            onChange={(e) => toggleProjectileUpcast(e.target.checked)}
                          />
                          <span className="text-sm text-dim">Upcast adds projectiles</span>
                        </label>
                      </div>
                    </div>
                    {projectiles.upcast && (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="label">Count per step</label>
                          <input
                            type="number"
                            className="input"
                            min={1}
                            value={projectiles.upcast.count}
                            onChange={(e) =>
                              set("outputType", {
                                ...out,
                                projectiles: {
                                  ...projectiles,
                                  upcast: { ...projectiles.upcast!, count: +e.target.value },
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="label">Every N Levels</label>
                          <input
                            type="number"
                            className="input"
                            min={1}
                            value={projectiles.upcast.everyNLevels}
                            onChange={(e) =>
                              set("outputType", {
                                ...out,
                                projectiles: {
                                  ...projectiles,
                                  upcast: { ...projectiles.upcast!, everyNLevels: +e.target.value },
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="label">Above Level</label>
                          <input
                            type="number"
                            className="input"
                            min={1}
                            max={12}
                            value={projectiles.upcast.aboveLevel}
                            onChange={(e) =>
                              set("outputType", {
                                ...out,
                                projectiles: {
                                  ...projectiles,
                                  upcast: { ...projectiles.upcast!, aboveLevel: +e.target.value },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes / Description</label>
          <textarea
            className="input resize-none"
            rows={3}
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value || null)}
            maxLength={4000}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button type="submit" className="btn-primary flex-1 justify-center" disabled={isPending}>
            {isPending ? "Saving…" : editing ? "Save Changes" : "Add Spell"}
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
