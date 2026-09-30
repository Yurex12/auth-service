import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logoutApi } from '../api/authApi';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: (data) => {
      queryClient.clear();
      toast.success(data.message || 'Logged out successfully');
    },
    onError: (error) => toast.error(error.message || 'Logout failed'),
  });
}
