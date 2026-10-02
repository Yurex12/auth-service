import { useQuery } from '@tanstack/react-query';
import { getSessionsApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useSessions() {
  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: getSessionsApi,
  });
}
