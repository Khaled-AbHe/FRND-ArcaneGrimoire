import { useQueryClient } from "@tanstack/react-query";
import { AUTH_KEY } from "./useCurrentUser";
import type { User } from "../../types";

/**
 * Returns an onSuccess handler shared by useSignIn and useSignUp.
 * The server sets the httpOnly cookie — we just seed the React Query cache.
 */
export function useAuthSuccessHandler() {
  const qc = useQueryClient();
  return (user: User) => {
    qc.setQueryData(AUTH_KEY, user);
    qc.removeQueries({ predicate: (q) => q.queryKey[0] !== AUTH_KEY[0] });
  };
}
