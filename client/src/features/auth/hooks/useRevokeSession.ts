import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { revokeSessionApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => revokeSessionApi(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
      toast.success(data.message || 'Session revoked successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to revoke session');
    },
  });
}
