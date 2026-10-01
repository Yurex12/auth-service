import { useQuery } from '@tanstack/react-query';
import { getUserAccountsApi } from '../api/authApi';
import { authKeys } from './authKeys';

export function useUserAccounts() {
  return useQuery({
    queryKey: authKeys.accounts(),
    queryFn: getUserAccountsApi,
  });
}
