import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { requestPasswordResetApi } from '../api/authApi';

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: requestPasswordResetApi,
    onSuccess: (data) =>
      toast.success(data.message || 'Password reset code sent to your email'),
    onError: (error) =>
      toast.error(error.message || 'Failed to request password reset'),
  });
}
