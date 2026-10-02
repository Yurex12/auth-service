import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { requestSetPasswordApi } from '../api/authApi';

export function useRequestSetPassword() {
  return useMutation({
    mutationFn: requestSetPasswordApi,
    onSuccess: (data) => {
      toast.success(data.message || 'Verification code sent to your email');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send verification code');
    },
  });
}
