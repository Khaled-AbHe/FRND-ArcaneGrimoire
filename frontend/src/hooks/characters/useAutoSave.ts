import { useCallback, useEffect, useRef } from "react";
import { useUpdateCharacter } from "./useUpdateCharacter";
import type { Character, UpdateCharacterDto } from "../../types";

export function useAutoSave(id: number | null, delay = 600) {
  const updateChar = useUpdateCharacter(id ?? 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<Character | null>(null);
  const mutateRef = useRef(updateChar.mutate);

  useEffect(() => {
    mutateRef.current = updateChar.mutate;
  });

  // Flush immediately — cancels the debounce timer and fires right away
  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const c = latestRef.current;
    if (!c || !id) return;
    const dto: UpdateCharacterDto = {
      name: c.name,
      levels: c.levels,
      prepared: c.prepared,
      pact: c.pact,
      globals: c.globals,
    };
    mutateRef.current(dto);
    latestRef.current = null;
  }, [id]);

  // Flush on page unload (refresh, close tab, navigate away)
  useEffect(() => {
    const handler = () => flush();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [flush]);

  // Flush on unmount (switching characters, navigating back)
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
        const dto: UpdateCharacterDto = {
          name: c.name,
          levels: c.levels,
          prepared: c.prepared,
          pact: c.pact,
          globals: c.globals,
        };
        mutateRef.current(dto);
        latestRef.current = null;
      }, delay);
    },
    [id, delay]
  );
}
