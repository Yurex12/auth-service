import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetPasswordApi } from '../api/authApi';

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (data) =>
      toast.success(data.message || 'Password reset successfully'),
    onError: (error) =>
      toast.error(error.message || 'Failed to reset password'),
  });
}
