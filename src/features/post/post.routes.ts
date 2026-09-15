import express from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/auth.permission.middleware.js';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../../middleware/validation.js';
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from './post.controller.js';
import {
  createPostSchema,
  getPostsQuerySchema,
  postIdParamsSchema,
  updatePostSchema,
} from './post.schema.js';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  requirePermission('posts:read'),
  validateRequestQuery(getPostsQuerySchema),
  getPosts,
);

router.post(
  '/',
  requireAuth,
  requirePermission('posts:create'),
  validateRequestBody(createPostSchema),
  createPost,
);

router.get(
  '/:id',
  requireAuth,
  requirePermission('posts:read'),
  validateRequestParams(postIdParamsSchema),
  getPost,
);

router.patch(
  '/:id',
  requireAuth,
  requirePermission('posts:update'),
  validateRequestParams(postIdParamsSchema),
  validateRequestBody(updatePostSchema),
  updatePost,
);

router.delete(
  '/:id',
  requireAuth,
  requirePermission('posts:delete'),
  validateRequestParams(postIdParamsSchema),
  deletePost,
);

export default router;
