import { charactersApi } from "../../api";
import { useInvalidatingMutation } from "../utils/mutations";
import { characterKeys } from "./characterKeys";

export function useDeleteCharacter() {
  return useInvalidatingMutation(
    (id: number) => charactersApi.remove(id),
    characterKeys.all(),
  );
}
