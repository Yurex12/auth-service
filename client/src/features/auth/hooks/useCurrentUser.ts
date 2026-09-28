import { useQuery } from '@tanstack/react-query';
import { getCurrentUserApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUserApi,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
