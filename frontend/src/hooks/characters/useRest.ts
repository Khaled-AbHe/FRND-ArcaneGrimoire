import { useCachingMutation } from "../utils/mutations";
import { charactersApi } from "../../api";
import { characterKeys } from "./characterKeys";

/**
 * Returns both shortRest and longRest mutations for a character.
 * Replaces the separate useShortRest and useLongRest hooks.
 */
export function useRest(id: number) {
  const shortRest = useCachingMutation(() => charactersApi.shortRest(id), characterKeys.detail(id));

  const longRest = useCachingMutation(() => charactersApi.longRest(id), characterKeys.detail(id));

  return { shortRest, longRest };
}
