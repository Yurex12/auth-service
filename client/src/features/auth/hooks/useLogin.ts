import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginApi } from '../api/authApi';
import type { LoginInput } from '../schemas/authSchema';
import { authKeys } from './authKeys';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => loginApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}
