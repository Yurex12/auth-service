import { useQuery } from '@tanstack/react-query';
import { getUsersApi } from '../api/userApi';
import { userKeys } from './userKeys';
import type { GetUsersParams } from '../types/userTypes';

export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsersApi(params),
  });
}
