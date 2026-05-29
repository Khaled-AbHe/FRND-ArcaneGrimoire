import { useQueryClient, useMutation } from "@tanstack/react-query";
import { authApi } from "../../api";
import { CreateUserDto } from "../../types";
import { AUTH_KEY } from "./useCurrentUser";

export function useSignUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserDto) => authApi.signUp(dto),
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user);
      qc.removeQueries({
        predicate: (query) => query.queryKey[0] !== AUTH_KEY[0],
      });
    },
  });
}
