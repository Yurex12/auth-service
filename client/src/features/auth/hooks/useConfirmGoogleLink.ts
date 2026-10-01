import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { confirmGoogleLinkApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useConfirmGoogleLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmGoogleLinkApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success(data.message || 'Google account linked successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to link Google account');
    },
  });
}
