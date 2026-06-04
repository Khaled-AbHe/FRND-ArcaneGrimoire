import { userApi, UpdateUserDto } from "../../api";
import { useCachingMutation } from "../utils/mutations";
import { AUTH_KEY } from "../auth/useCurrentUser";

export function useUpdateUser() {
  return useCachingMutation(
    (dto: UpdateUserDto) => userApi.update(dto),
    AUTH_KEY,
  );
}
