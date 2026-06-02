import { useQueryClient, useMutation } from "@tanstack/react-query";
import { authApi } from "../../api";
import { AUTH_KEY } from "./useCurrentUser";

export function useSignOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.signOut(),
    onSuccess: () => {
      // Server clears the httpOnly cookie — we just clear the React Query cache
      qc.setQueryData(AUTH_KEY, null);
      qc.clear();
    },
  });
}
