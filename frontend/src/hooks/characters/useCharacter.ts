import { useQuery } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { characterKey } from "./useCharacters";

export function useCharacter(id: number | null) {
  return useQuery({
    queryKey: characterKey(id!),
    queryFn: () => charactersApi.get(id!),
    enabled: id !== null,
  });
}
