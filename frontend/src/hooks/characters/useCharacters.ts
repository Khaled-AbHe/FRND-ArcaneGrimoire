import { useQuery } from "@tanstack/react-query";
import { charactersApi } from "../../api";

export const CHARACTERS_KEY = ["characters"] as const;
export const characterKey = (id: number) => ["characters", id] as const;
export const computedKey = (id: number) => ["characters", id, "computed"] as const;

export function useCharacters() {
  return useQuery({
    queryKey: CHARACTERS_KEY,
    queryFn: charactersApi.list,
  });
}
