import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api";
import { CreateUserDto } from "../../types";
import { useAuthSuccessHandler } from "./useAuthSuccessHandler";

export function useSignUp() {
  const onSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: (dto: CreateUserDto) => authApi.signUp(dto),
    onSuccess,
  });
}
