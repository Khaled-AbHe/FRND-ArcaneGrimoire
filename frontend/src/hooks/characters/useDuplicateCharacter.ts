import { charactersApi } from "../../api";
import { useInvalidatingMutation } from "../utils/mutations";
import { characterKeys } from "./characterKeys";

export function useDuplicateCharacter() {
  return useInvalidatingMutation(
    ({ id, name }: { id: number; name: string }) => charactersApi.duplicate(id, name),
    characterKeys.all(),
  );
}
