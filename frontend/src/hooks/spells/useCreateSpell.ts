import { useQueryClient, useMutation } from "@tanstack/react-query";
import { spellsApi } from "../../api";
import { CreateSpellDto } from "../../types";
import { SPELLS_KEY } from "./useSpells";

export function useCreateSpell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSpellDto) => spellsApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPELLS_KEY }),
  });
}
