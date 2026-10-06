import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/apiTypes';
import type {
  GetUsersParams,
  UpdateUserRoleInput,
  UserResponse,
  UsersResponse,
} from '../types/userTypes';

export const getUsersApi = async (
  params?: GetUsersParams,
): Promise<UsersResponse> => {
  const response = await apiClient.get<UsersResponse>('/users', { params });
  return response.data;
};

export const getUserByIdApi = async (id: string): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>(`/users/${id}`);
  return response.data;
};

export const updateUserRoleApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserRoleInput;
}): Promise<UserResponse> => {
  const response = await apiClient.patch<UserResponse>(`/users/${id}/role`, data);
  return response.data;
};

export const deleteUserApi = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/users/${id}`);
  return response.data;
};
