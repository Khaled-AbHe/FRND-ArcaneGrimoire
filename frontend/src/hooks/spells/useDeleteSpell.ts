import { spellsApi } from "../../api";
import { useInvalidatingMutation } from "../utils/mutations";
import { spellKeys } from "./spellKeys";

export function useDeleteSpell() {
  return useInvalidatingMutation(
    (id: number) => spellsApi.remove(id),
    spellKeys.all(),
  );
}
