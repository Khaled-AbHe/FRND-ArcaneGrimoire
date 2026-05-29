// ── User ──────────────────────────────────────────────────────────────────────

export type UserType = "Base" | "Admin";

export interface User {
  userId: number;
  username: string;
  email: string;
  userType: UserType;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

// ── Spell sub-types ───────────────────────────────────────────────────────────

export type SpellLevel =
  | "cantrip"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export type AttackType = "Melee Spell Attack" | "Ranged Spell Attack";
export type SaveAbility =
  | "Strength"
  | "Dexterity"
  | "Constitution"
  | "Intelligence"
  | "Wisdom"
  | "Charisma";
export type MagicSchool =
  | "Abjuration"
  | "Conjuration"
  | "Divination"
  | "Enchantment"
  | "Evocation"
  | "Illusion"
  | "Necromancy"
  | "Transmutation";
export type DiceType = "Target" | "d0" | "d1" | "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "100";
export type OutputType =
  | "Piercing"
  | "Bludgeoning"
  | "Slashing"
  | "Acid"
  | "Cold"
  | "Fire"
  | "Lightning"
  | "Poison"
  | "Thunder"
  | "Force"
  | "Radiant"
  | "Necrotic"
  | "Psychic"
  | "Elemental"
  | "Mystical"
  | "Temporary HP"
  | "Healing"
  | "Additional Beast";

// components
export interface SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material?: string;
}

// spellType discriminated union
export type SpellType =
  | { kind: "attack"; attackType: AttackType; critRange?: number }
  | { kind: "save"; saveAbility: SaveAbility }
  | { kind: "utility" };

// outputType sub-types
export interface DiceEntry {
  count: number;
  die: DiceType;
  type: OutputType;
  addCastingMod?: boolean;
  flatBonus?: number;
}

export interface UpcastEntry {
  count: number;
  die: DiceType;
  type: OutputType;
  everyNLevels: number;
  aboveLevel: number;
  flatBonus?: number;
}

export interface Projectiles {
  baseCount: number;
  upcast?: {
    count: number;
    everyNLevels: number;
    aboveLevel: number;
  };
}

export type ScalingThreshold =
  | { characterLevel: number; diceCount: number; projCount?: never }
  | { characterLevel: number; projCount: number; diceCount?: never };

// outputType discriminated union
export type OutputTypeShape =
  | {
      kind: "leveled";
      dice: DiceEntry[];
      projectiles?: Projectiles;
      upcast?: { dice: UpcastEntry[] };
    }
  | { kind: "cantrip"; dice: DiceEntry[]; scaling: ScalingThreshold[] }
  | { kind: "utility" };

// ── Spell ─────────────────────────────────────────────────────────────────────

export interface Spell {
  id: number;
  name: string;
  level: SpellLevel;
  school: MagicSchool;
  castTime: string;
  range: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  components: SpellComponents;
  spellType: SpellType;
  outputType: OutputTypeShape;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateSpellDto = Omit<Spell, "id" | "createdAt" | "updatedAt">;
export type UpdateSpellDto = Partial<CreateSpellDto>;

// ── Character nested types ────────────────────────────────────────────────────

export interface LevelRow {
  id: string;
  label: string;
  total: number;
  used: number;
}

export interface ArcanaSlot {
  level: number; // 6–9
  spellId: number | null;
  used: boolean;
}

export interface PactMagic {
  enabled: boolean;
  slots: number;
  slotLevel: number;
  used: number;
  arcana: ArcanaSlot[];
}

export interface CharacterGlobals {
  mod: number;
  prof: number;
  charLevel: number;
  highMagic: boolean;
}

// ── Character ─────────────────────────────────────────────────────────────────

export interface Character {
  id: number;
  name: string;
  levels: LevelRow[];
  prepared: number[];
  pact: PactMagic;
  globals: CharacterGlobals;
  createdAt: string;
  updatedAt: string;
}

export type CreateCharacterDto = {
  name: string;
  levels?: LevelRow[];
  prepared?: number[];
  pact?: PactMagic;
  globals?: CharacterGlobals;
};

export type UpdateCharacterDto = Partial<CreateCharacterDto>;

// ── Computed stats (from backend) ─────────────────────────────────────────────

export interface ComputedStats {
  spellSaveDC: number;
  attackBonus: number;
  cantripTier: number;
  charLevel: number;
  spellMod: number;
}

// ── Template ──────────────────────────────────────────────────────────────────

export type CasterTemplate = "full" | "half" | "warlock";

export interface TemplateResult {
  casterType: CasterTemplate;
  charLevel: number;
  levels: LevelRow[];
  pact: PactMagic | null;
}

// ── Dice rolling ──────────────────────────────────────────────────────────────

export interface DieRoll {
  sides: number;
  result: number;
}

export interface ProjectileResult {
  attackRoll: DieRoll | null;
  d20: number | null;
  bonus: number | null;
  total: number | null;
  isCrit: boolean;
  isMiss: boolean;
  damageRolls: { die: string; result: number; type: string }[];
  damageTotals: Record<string, number>;
  damageModifier: number;
  grandTotal: number;
}

export interface CastResult {
  spellName: string;
  slotLevel: number | "pact" | "cantrip";
  saveDC: number | null;
  attackBonus: number | null;
  projectiles: ProjectileResult[];
  spellModifier: number;
  grandTotal: number;
  isCrit: boolean;
}

// ── UI helpers ────────────────────────────────────────────────────────────────

export type TabId = "slots" | "preparer" | "settings" | "characters" | "spells";

export const SCHOOLS = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
] as const;

export type School = (typeof SCHOOLS)[number];

export const ABILITIES = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
] as const;

export type Ability = (typeof ABILITIES)[number];

export const SPELL_LEVELS: SpellLevel[] = ["cantrip", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const HIGH_SPELL_LEVELS: SpellLevel[] = ["10", "11", "12"];

export const DIE_TYPES: DiceType[] = ["d4", "d6", "d8", "d10", "d12", "d20", "100"];

export const ATTACK_TYPES: AttackType[] = ["Melee Spell Attack", "Ranged Spell Attack"];

export const OUTPUT_TYPES: OutputType[] = [
  "Piercing",
  "Bludgeoning",
  "Slashing",
  "Acid",
  "Cold",
  "Fire",
  "Lightning",
  "Poison",
  "Thunder",
  "Force",
  "Radiant",
  "Necrotic",
  "Psychic",
  "Elemental",
  "Mystical",
  "Temporary HP",
  "Healing",
  "Additional Beast",
];
