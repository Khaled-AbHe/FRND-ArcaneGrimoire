import { useQueryClient, useMutation } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { UpdateCharacterDto } from "../../types";
import { characterKey } from "./useCharacters";

export function useUpdateCharacter(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateCharacterDto) => charactersApi.update(id, dto),
    onSuccess: (updated) => {
      // Keep the query cache fresh so switching characters re-loads correctly
      qc.setQueryData(characterKey(id), updated);
    },
  });
}
