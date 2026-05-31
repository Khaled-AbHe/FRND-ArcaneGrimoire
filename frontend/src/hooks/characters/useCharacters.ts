import { useQuery } from "@tanstack/react-query";
import { charactersApi } from "../../api";
import { characterKeys } from "./characterKeys";

export function useCharacters() {
  return useQuery({
    queryKey: characterKeys.all(),
    queryFn: charactersApi.list,
  });
}
