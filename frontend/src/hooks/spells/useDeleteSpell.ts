import { useQueryClient, useMutation } from "@tanstack/react-query";
import { spellsApi } from "../../api";
import { SPELLS_KEY } from "./useSpells";

export function useDeleteSpell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => spellsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SPELLS_KEY }),
  });
}
