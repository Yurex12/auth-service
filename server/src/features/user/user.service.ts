import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { usersTable } from '../../db/schema.js';
import { AppError } from '../../utils/app-error.js';
import { usersPerPage } from './user.constant.js';
import type { UpdateUserInput, UpdateUserRoleInput } from './user.schema.js';

export const getUsers = async (data: {
  page: number | undefined;
  limit: number | undefined;
}) => {
  const page = data.page ?? 1;
  const limit = data.limit ?? usersPerPage;

  const [users, total] = await Promise.all([
    db.query.usersTable.findMany({
      orderBy: (user, { desc }) => [desc(user.createdAt)],
      with: {
        role: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      limit: limit,
      offset: (page - 1) * limit,
    }),
    db.$count(usersTable),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const getUserById = async (targetUserId: string) => {
  const user = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.id, targetUserId),
    with: {
      role: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) throw new AppError('User not found', 404);

  return { user };
};

export const updateUser = async ({
  targetUserId,
  callerUserId,
  role,
  data,
}: {
  targetUserId: string;
  callerUserId: string;
  role: string;
  data: UpdateUserInput;
}) => {
  if (role !== 'admin' && callerUserId !== targetUserId)
    throw new AppError('Forbidden', 403);

  const [updatedUser] = await db
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, targetUserId))
    .returning();

  if (!updatedUser) throw new AppError('User not found', 404);

  const userWithRole = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.id, targetUserId),
    with: {
      role: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  return { user: userWithRole! };
};

export const updateUserRole = async ({
  targetUserId,
  callerUserId,
  data,
}: {
  targetUserId: string;
  callerUserId: string;
  data: UpdateUserRoleInput;
}) => {
  if (callerUserId === targetUserId)
    throw new AppError('Cannot change your own role', 400);

  const role = await db.query.rolesTable.findFirst({
    where: (roleTable, { eq }) => eq(roleTable.name, data.roleName),
  });

  if (!role) throw new AppError('Role not found', 404);

  const [updatedUser] = await db
    .update(usersTable)
    .set({ roleId: role.id })
    .where(eq(usersTable.id, targetUserId))
    .returning();

  if (!updatedUser) throw new AppError('User not found', 404);

  return {
    user: {
      ...updatedUser,
      role: {
        id: role.id,
        name: role.name,
      },
    },
  };
};

export const deleteUser = async ({
  targetUserId,
  callerUserId,
}: {
  targetUserId: string;
  callerUserId: string;
}) => {
  if (callerUserId === targetUserId)
    throw new AppError('Cannot delete your own account', 403);

  const [deletedUser] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, targetUserId))
    .returning({ id: usersTable.id });

  if (!deletedUser) throw new AppError('User not found', 404);
};
