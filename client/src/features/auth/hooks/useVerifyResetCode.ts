import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { verifyPasswordResetCodeApi } from '../api/authApi';

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: verifyPasswordResetCodeApi,
    onError: (error) =>
      toast.error(error.message || 'Failed to verify reset code'),
  });
}
