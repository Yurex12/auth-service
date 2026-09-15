import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { permissionsTable, rolePermissionsTable } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { AppError } from '../utils/app-error.js';

export const requirePermission = (requestedPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const roleId = req.user.roleId;

    const data = await db
      .select({
        permissionId: permissionsTable.id,
      })
      .from(rolePermissionsTable)
      .innerJoin(
        permissionsTable,
        and(
          eq(permissionsTable.id, rolePermissionsTable.permissionId),
          eq(permissionsTable.name, requestedPermission),
        ),
      )
      .where(eq(rolePermissionsTable.roleId, roleId));

    if (!data.length) throw new AppError('Forbidden', 403);

    next();
  };
};
