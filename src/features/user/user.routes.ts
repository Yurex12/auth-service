import express from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/auth.permission.middleware.js';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../../middleware/validation.js';
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserRole,
} from './user.controller.js';
import {
  getUsersQuerySchema,
  updateUserRoleSchema,
  updateUserSchema,
  userIdParamsSchema,
} from './user.schema.js';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  requirePermission('users:read'),
  validateRequestQuery(getUsersQuerySchema),
  getUsers,
);

router.get(
  '/:id',
  requireAuth,
  requirePermission('users:read'),
  validateRequestParams(userIdParamsSchema),
  getUser,
);

router.patch(
  '/:id/role',
  requireAuth,
  requirePermission('users:role:update'),
  validateRequestParams(userIdParamsSchema),
  validateRequestBody(updateUserRoleSchema),
  updateUserRole,
);

router.patch(
  '/:id',
  requireAuth,
  validateRequestParams(userIdParamsSchema),
  validateRequestBody(updateUserSchema),
  updateUser,
);

router.delete(
  '/:id',
  requireAuth,
  requirePermission('users:delete'),
  validateRequestParams(userIdParamsSchema),
  deleteUser,
);

export default router;
