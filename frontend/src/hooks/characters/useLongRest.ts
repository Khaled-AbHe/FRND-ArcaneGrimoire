import { useQueryClient, useMutation } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { characterKey } from "./useCharacters";

export function useLongRest(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => charactersApi.longRest(id),
    onSuccess: (updated) => qc.setQueryData(characterKey(id), updated),
  });
}
