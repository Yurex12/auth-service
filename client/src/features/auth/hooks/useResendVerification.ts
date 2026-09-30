import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resendVerificationApi } from '../api/authApi';

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerificationApi,
    onSuccess: (data) =>
      toast.success(data.message || 'Verification code sent to your email'),
    onError: (error) =>
      toast.error(error.message || 'Failed to resend verification code'),
  });
}
