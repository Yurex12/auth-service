import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unlinkGoogleAccountApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useUnlinkGoogle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlinkGoogleAccountApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      toast.success(data.message || 'Google account unlinked successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to unlink Google account');
    },
  });
}
