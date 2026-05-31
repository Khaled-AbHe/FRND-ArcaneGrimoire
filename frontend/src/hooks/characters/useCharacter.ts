import { useQuery } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { characterKeys } from "./characterKeys";

export function useCharacter(id: number | null) {
  return useQuery({
    queryKey: characterKeys.detail(id!),
    queryFn: () => charactersApi.get(id!),
    enabled: id !== null,
  });
}
