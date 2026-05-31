import { charactersApi } from "../../api";
import { UpdateCharacterDto } from "../../types";
import { useCachingMutation } from "../utils/mutations";
import { characterKeys } from "./characterKeys";

export function useUpdateCharacter(id: number) {
  return useCachingMutation(
    (dto: UpdateCharacterDto) => charactersApi.update(id, dto),
    characterKeys.detail(id),
  );
}
