import { useQueryClient, useMutation } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { CHARACTERS_KEY } from "./useCharacters";

export function useDuplicateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => charactersApi.duplicate(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHARACTERS_KEY }),
  });
}
