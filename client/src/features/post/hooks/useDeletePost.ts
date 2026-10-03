import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deletePostApi } from '../api/postApi';
import { postKeys } from './postKeys';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePostApi(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast.success(data.message || 'Post deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });
}
