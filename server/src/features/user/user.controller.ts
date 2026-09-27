import type { Request, Response } from 'express';
import type { TypedRequest } from '../../types/express.js';
import type {
  GetUsersQuery,
  UpdateUserInput,
  UpdateUserRoleInput,
  UserIdParam,
} from './user.schema.js';
import {
  deleteUser as deleteUserService,
  getUserById as getUserByIdService,
  getUsers as getUsersService,
  updateUser as updateUserService,
  updateUserRole as updateUserRoleService,
} from './user.service.js';

export const getUsers = async (
  req: TypedRequest<unknown, Record<string, string>, GetUsersQuery>,
  res: Response,
) => {
  const { users, pagination } = await getUsersService({
    page: req.query.page,
    limit: req.query.limit,
  });

  res.json({
    success: true,
    message: 'Users fetched successfully',
    users,
    pagination,
  });
};

export const getUser = async (
  req: TypedRequest<unknown, UserIdParam>,
  res: Response,
) => {
  const { user } = await getUserByIdService(req.params.id);

  res.json({
    success: true,
    message: 'User fetched successfully',
    user,
  });
};

export const updateUser = async (
  req: TypedRequest<UpdateUserInput, UserIdParam>,
  res: Response,
) => {
  const { user } = await updateUserService({
    targetUserId: req.params.id,
    callerUserId: req.userId,
    role: req.user.role.name,
    data: req.body,
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    user,
  });
};

export const updateUserRole = async (
  req: TypedRequest<UpdateUserRoleInput, UserIdParam>,
  res: Response,
) => {
  const { user } = await updateUserRoleService({
    targetUserId: req.params.id,
    callerUserId: req.userId,
    data: req.body,
  });

  res.json({
    success: true,
    message: 'User role updated successfully',
    user,
  });
};

export const deleteUser = async (
  req: TypedRequest<unknown, UserIdParam>,
  res: Response,
) => {
  await deleteUserService({
    targetUserId: req.params.id,
    callerUserId: req.userId,
  });

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
};
