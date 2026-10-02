import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { verifySetPasswordCodeApi } from '../api/authApi';

export function useVerifySetPasswordCode() {
  return useMutation({
    mutationFn: verifySetPasswordCodeApi,
    onError: (error) => {
      toast.error(error.message || 'Failed to verify code');
    },
  });
}
