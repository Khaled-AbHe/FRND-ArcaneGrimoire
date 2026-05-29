import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api";

export const AUTH_KEY = ["auth", "me"];

/** Returns the currently logged-in user, or null if not authenticated. */
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: () => authApi.whoAmI().catch(() => null),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    retry: false,
  });
}
