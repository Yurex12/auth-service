import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { revokeOtherSessionsApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeOtherSessionsApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
      toast.success(data.message || 'Other sessions revoked successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to revoke other sessions');
    },
  });
}
