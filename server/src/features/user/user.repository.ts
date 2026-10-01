import { db } from '../../db/index.js';

export const userRoleRelations = {
  role: {
    columns: {
      id: true,
      name: true,
    },
  },
} as const;

export const findUserById = async (id: string) => {
  return db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    with: userRoleRelations,
  });
};

export const findUserByEmail = async (email: string) => {
  return db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
    with: userRoleRelations,
  });
};
