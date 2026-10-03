import { useQuery } from '@tanstack/react-query';
import { getPostsApi } from '../api/postApi';
import { postKeys } from './postKeys';
import type { GetPostsParams } from '../types/postTypes';

export function usePosts(params?: GetPostsParams) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => getPostsApi(params),
  });
}
