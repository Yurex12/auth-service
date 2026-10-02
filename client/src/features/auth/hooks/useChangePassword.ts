import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePasswordApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success(data.message || 'Password changed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}
