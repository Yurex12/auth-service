import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { verifyPasswordResetCodeApi } from '../api/authApi';

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: verifyPasswordResetCodeApi,
    onSuccess: (data) =>
      toast.success(data.message || 'Reset code verified successfully'),
    onError: (error) =>
      toast.error(error.message || 'Failed to verify reset code'),
  });
}
