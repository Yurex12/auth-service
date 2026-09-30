import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { verifyEmailApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmailApi,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data);
      toast.success(data.message || 'Email verified successfully');
    },
    onError: (error) => toast.error(error.message || 'Verification failed'),
  });
}
