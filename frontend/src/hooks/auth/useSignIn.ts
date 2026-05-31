import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api";
import { SignInDto } from "../../types";
import { useAuthSuccessHandler } from "./useAuthSuccessHandler";

export function useSignIn() {
  const onSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: (dto: SignInDto) => authApi.signIn(dto),
    onSuccess,
  });
}
