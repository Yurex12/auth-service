import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { setPasswordApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useSetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setPasswordApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success(data.message || 'Password set successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to set password');
    },
  });
}
