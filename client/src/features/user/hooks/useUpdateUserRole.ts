import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUserRoleApi } from '../api/userApi';
import { userKeys } from './userKeys';
import type { UpdateUserRoleInput } from '../types/userTypes';

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRoleInput }) =>
      updateUserRoleApi({ id, data }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      toast.success(data.message || 'User role updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update user role');
    },
  });
}
