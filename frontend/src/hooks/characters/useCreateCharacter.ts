import { charactersApi } from "../../api";
import { CreateCharacterDto } from "../../types";
import { useInvalidatingMutation } from "../utils/mutations";
import { characterKeys } from "./characterKeys";

export function useCreateCharacter() {
  return useInvalidatingMutation(
    (dto: CreateCharacterDto) => charactersApi.create(dto),
    characterKeys.all(),
  );
}
