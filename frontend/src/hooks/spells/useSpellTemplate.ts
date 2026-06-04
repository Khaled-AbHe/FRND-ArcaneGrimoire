import { useMutation } from "@tanstack/react-query";
import { spellsApi } from "../../api";
import { CasterTemplate } from "../../types";

export function useSpellTemplate() {
  // const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      casterType,
      charLevel,
    }: {
      casterType: CasterTemplate;
      charLevel: number;
    }) => spellsApi.template(casterType, charLevel),
  });
}
