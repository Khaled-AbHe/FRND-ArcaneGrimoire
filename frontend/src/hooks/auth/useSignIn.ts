import { useQueryClient, useMutation } from "@tanstack/react-query";
import { authApi } from "../../api";
import { SignInDto } from "../../types";
import { AUTH_KEY } from "./useCurrentUser";

export function useSignIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: SignInDto) => authApi.signIn(dto),
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user);
      qc.removeQueries({
        predicate: (query) => query.queryKey[0] !== AUTH_KEY[0],
      });
    },
  });
}
