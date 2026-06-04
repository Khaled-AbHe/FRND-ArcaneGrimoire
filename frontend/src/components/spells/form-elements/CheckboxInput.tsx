import { CreateSpellDto, SpellComponents } from "../../../types";
import { ReactNode } from "react";

type CheckboxInputProps =
  | {
      children: ReactNode;
      element: keyof CreateSpellDto;
      isChecked: boolean;
      set<K extends keyof CreateSpellDto>(
        key: K,
        value: CreateSpellDto[K],
      ): void;
      setComp?: never;
      setSpellTypeKind?: never;
      setOutputKind?: never;
    }
  | {
      children: ReactNode;
      element: keyof SpellComponents;
      isChecked: boolean;
      set?: never;
      setComp<K extends keyof SpellComponents>(
        key: K,
        value: SpellComponents[K],
      ): void;
      setSpellTypeKind?: never;
      setOutputKind?: never;
    }
  | {
      children: ReactNode;
      element: "attack" | "save" | "utility";
      isChecked: boolean;
      set?: never;
      setComp?: never;
      setSpellTypeKind(kind: "attack" | "save" | "utility"): void;
      setOutputKind?: never;
    }
  | {
      children: ReactNode;
      element: "leveled" | "cantrip" | "utility";
      isChecked: boolean;
      set?: never;
      setComp?: never;
      setSpellTypeKind?: never;
      setOutputKind(kind: "cantrip" | "utility" | "leveled"): void;
    };

export function CheckboxInput({
  children,
  element,
  isChecked,
  set,
  setComp,
  setSpellTypeKind,
  setOutputKind,
}: CheckboxInputProps) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2">
      <button
        type="button"
        className={
          !isChecked
            ? "btn-primary h-[100%] w-full justify-center px-3 py-2 text-xs"
            : "btn-ghost h-[100%] w-full justify-center px-3 py-2 text-xs"
        }
        onClick={() => {
          if (set) {
            set(element, isChecked);
          } else if (setComp) {
            setComp(element, isChecked);
          } else if (setSpellTypeKind) {
            setSpellTypeKind(element);
          } else if (setOutputKind) {
            setOutputKind(element);
          }
        }}
      >
        {children}
      </button>
    </label>
  );
}
