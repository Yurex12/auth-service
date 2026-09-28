import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
}
