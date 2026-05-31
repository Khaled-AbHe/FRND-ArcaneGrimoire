import { useQuery } from "@tanstack/react-query";
import { spellsApi } from "../../api";
import { spellKeys } from "./spellKeys";

export function useSpells() {
  return useQuery({
    queryKey: spellKeys.all(),
    queryFn: spellsApi.list,
    staleTime: 1000 * 60 * 5,
  });
}
