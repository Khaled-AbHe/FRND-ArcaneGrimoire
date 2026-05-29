import { useQuery } from "@tanstack/react-query";
import { spellsApi } from "../../api";

export const SPELLS_KEY = ["spells"] as const;

export function useSpells() {
  return useQuery({
    queryKey: SPELLS_KEY,
    queryFn: spellsApi.list,
    staleTime: 1000 * 60 * 5, // spellbook changes infrequently
  });
}
