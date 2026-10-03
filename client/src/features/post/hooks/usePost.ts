import { useQuery } from '@tanstack/react-query';
import { getPostApi } from '../api/postApi';
import { postKeys } from './postKeys';

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostApi(id),
    enabled: Boolean(id),
  });
}
