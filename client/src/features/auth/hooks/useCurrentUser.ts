import { useQuery } from '@tanstack/react-query';
import { getCurrentUserApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUserApi,
    retry: (failureCount, error: any) => {
      if (error?.status === 401) return false;

      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5,
  });
}
