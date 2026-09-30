import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loginApi } from '../api/authApi';
import type { LoginFormValues } from '../schemas/authSchema';
import { authKeys } from './authKeys';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginApi(data),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data);
      toast.success(data.message || 'Logged in successfully');
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.message || 'Login failed');
    },
  });
}
