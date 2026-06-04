import { spellsApi } from "../../api";
import { CreateSpellDto } from "../../types";
import { useInvalidatingMutation } from "../utils/mutations";
import { spellKeys } from "./spellKeys";

export function useCreateSpell() {
  return useInvalidatingMutation(
    (dto: CreateSpellDto) => spellsApi.create(dto),
    spellKeys.all(),
  );
}
