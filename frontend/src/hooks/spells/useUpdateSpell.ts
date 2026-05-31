import { spellsApi } from "../../api";
import { UpdateSpellDto } from "../../types";
import { useInvalidatingMutation } from "../utils/mutations";
import { spellKeys } from "./spellKeys";

export function useUpdateSpell() {
  return useInvalidatingMutation(
    ({ id, dto }: { id: number; dto: UpdateSpellDto }) => spellsApi.update(id, dto),
    spellKeys.all(),
  );
}
