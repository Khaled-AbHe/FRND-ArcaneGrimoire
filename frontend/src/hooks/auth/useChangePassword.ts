import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api";

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ userId, password }: { userId: number; password: string }) =>
      authApi.changePassword(userId, password),
  });
}
