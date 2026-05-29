import { useQueryClient, useMutation } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { CHARACTERS_KEY } from "./useCharacters";

export function useDeleteCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => charactersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHARACTERS_KEY }),
  });
}
