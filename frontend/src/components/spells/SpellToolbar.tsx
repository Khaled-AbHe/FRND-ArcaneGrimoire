import { levelLabel } from "../../utils/dice";
import { SCHOOLS, Spell, SPELL_LEVELS, SpellLevel } from "../../types";
import { PlusIcon } from "../ui/Icons";

interface SpellToolbarProps {
  search: string;
  setSearch: (value: React.SetStateAction<string>) => void;
  filterLevel: "" | SpellLevel;
  setFilterLevel: (value: React.SetStateAction<"" | SpellLevel>) => void;
  filterSchool: string;
  setFilterSchool: (value: React.SetStateAction<string>) => void;
  setEditSpell?: (value: React.SetStateAction<Spell | null>) => void;
  setFormOpen?: (value: React.SetStateAction<boolean>) => void;
}

export function SpellToolbar({
  search,
  setSearch,
  filterLevel,
  setFilterLevel,
  filterSchool,
  setFilterSchool,
  setEditSpell,
  setFormOpen,
}: SpellToolbarProps) {
  return (
    <div
      className="p-4 border-b space-y-2"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      <div className="flex justify-center gap-2">
        <input
          className="input flex-1 max-w-[40%]"
          placeholder="Search spells…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search spells by name"
        />
        <select
          className="select text-xs py-1"
          style={{ width: "auto" }}
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value as SpellLevel | "")}
          aria-label="Filter by spell level"
        >
          <option value="">All Levels</option>
          {SPELL_LEVELS.map((l) => (
            <option key={l} value={l}>
              {levelLabel(l)}
            </option>
          ))}
        </select>
        <select
          className="select text-xs py-1"
          style={{ width: "auto" }}
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          aria-label="Filter by magic school"
        >
          <option value="">All Schools</option>
          {SCHOOLS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {setEditSpell && setFormOpen && (
          <button
            className="btn-primary text-sm px-3 flex items-center gap-1.5 shrink-0"
            onClick={() => {
              setEditSpell(null);
              setFormOpen(true);
            }}
            aria-label="Add new spell"
          >
            <PlusIcon size={12} />
            Add Spell
          </button>
        )}
      </div>
    </div>
  );
}
