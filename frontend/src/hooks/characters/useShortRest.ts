import { useQueryClient, useMutation } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { characterKey } from "./useCharacters";

export function useShortRest(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => charactersApi.shortRest(id),
    onSuccess: (updated) => qc.setQueryData(characterKey(id), updated),
  });
}
