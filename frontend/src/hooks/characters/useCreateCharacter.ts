import { useQueryClient, useMutation } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { CreateCharacterDto } from "../../types";
import { CHARACTERS_KEY } from "./useCharacters";

export function useCreateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCharacterDto) => charactersApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHARACTERS_KEY }),
  });
}
