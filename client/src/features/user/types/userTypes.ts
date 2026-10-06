import type { ApiResponse } from '@/types/apiTypes';
import type { User } from '@/features/auth';

export type { User };

export type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UsersResponse = ApiResponse & {
  users: User[];
  pagination: PaginationInfo;
};

export type UserResponse = ApiResponse & {
  user: User;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
};

export type UpdateUserRoleInput = {
  roleName: string;
};
