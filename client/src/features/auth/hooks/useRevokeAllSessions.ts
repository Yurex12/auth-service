import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { revokeAllSessionsApi } from '../api/authApi';

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: revokeAllSessionsApi,
    onSuccess: (data) => {
      queryClient.clear();
      toast.success(data.message || 'All sessions revoked. Please sign in again.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to revoke all sessions');
    },
  });
}
