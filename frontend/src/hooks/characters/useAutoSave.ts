import { useCallback, useEffect, useRef } from "react";
import { useUpdateCharacter } from "./useUpdateCharacter";
import type { Character, UpdateCharacterDto } from "../../types";

function toDto(c: Character): UpdateCharacterDto {
  return {
    name: c.name,
    levels: c.levels,
    prepared: c.prepared,
    pact: c.pact,
    globals: c.globals,
  };
}

export function useAutoSave(id: number | null, delay = 600) {
  if (!id) return;
  const updateChar = useUpdateCharacter(id);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<Character | null>(null);
  const mutateRef = useRef(updateChar.mutate);

  useEffect(() => {
    mutateRef.current = updateChar.mutate;
  });

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const c = latestRef.current;
    if (!c || !id) return;
    mutateRef.current(toDto(c));
    latestRef.current = null;
  }, [id]);

  useEffect(() => {
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [flush]);

  useEffect(() => {
    return () => flush();
  }, [flush]);

  return useCallback(
    (char: Character) => {
      latestRef.current = char;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const c = latestRef.current;
        if (!c || !id) return;
        mutateRef.current(toDto(c));
        latestRef.current = null;
      }, delay);
    },
    [id, delay],
  );
}
