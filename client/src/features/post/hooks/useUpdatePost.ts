import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updatePostApi } from '../api/postApi';
import { postKeys } from './postKeys';
import type { UpdatePostInput } from '../types/postTypes';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) =>
      updatePostApi({ id, data }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.id),
      });
      toast.success(data.message || 'Post updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update post');
    },
  });
}
