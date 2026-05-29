import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, UpdateUserDto } from "../../api";
import { AUTH_KEY } from "../auth/useCurrentUser";

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => userApi.update(dto),
    onSuccess: (updated) => {
      // Keep the auth cache fresh so the header reflects the new username
      qc.setQueryData(AUTH_KEY, updated);
    },
  });
}
