import * as z from 'zod';

export const userIdParamsSchema = z.object({
  id: z.uuid().min(1, 'Id is required'),
});

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
});

export const updateUserRoleSchema = z.object({
  roleName: z.string().trim().min(1, 'Role name is required'),
});

export type UserIdParam = z.infer<typeof userIdParamsSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
