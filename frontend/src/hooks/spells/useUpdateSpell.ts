import { useQueryClient, useMutation } from "@tanstack/react-query";
import { spellsApi } from "../../api";
import { UpdateSpellDto } from "../../types";
import { SPELLS_KEY } from "./useSpells";

export function useUpdateSpell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateSpellDto }) => {
      return spellsApi.update(id, dto);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: SPELLS_KEY }),
  });
}
