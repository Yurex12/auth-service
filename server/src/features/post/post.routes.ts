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

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all posts
 *     description: Fetch a paginated list of posts for authenticated user
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: success
 *       401:
 *         description: unauthorized
 */

router.get(
  '/',
  requireAuth,
  requirePermission('posts:read'),
  validateRequestQuery(getPostsQuerySchema),
  getPosts,
);

/**
 * @swagger
 * /posts:
 *    post:
 *      summary: Creates a post
 *      description: Create a new post in the database and returns it
 *      tags: [Posts]
 *      security:
 *        - cookieAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required: [title, content]
 *              properties:
 *                title:
 *                  type: string
 *                  example: "My first post"
 *                content:
 *                  type: string
 *                  example: "This is my first post"
 *      responses:
 *        201:
 *          description: Post created successfully
 *        400:
 *          description: Validation error
 *        401:
 *          description: Unauthorized
 */

router.post(
  '/',
  requireAuth,
  requirePermission('posts:create'),
  validateRequestBody(createPostSchema),
  createPost,
);

/**
 * @swagger
 * /posts/{id}:
 *    get:
 *      summary: Fetch a single post
 *      description: Returns an object of post
 *      tags:
 *        - Posts
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Successful
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Post not found
 *        500:
 *          description: Internal server error
 */
router.get(
  '/:id',
  requireAuth,
  requirePermission('posts:read'),
  validateRequestParams(postIdParamsSchema),
  getPost,
);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Edit a post
 *     description: Edit title and content of a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first edited post
 *               content:
 *                 type: string
 *                 example: This is my first edited post
 *     responses:
 *       200:
 *          description: Post edited Successfully
 *       400:
 *          description: Bad request
 *       401:
 *          description: Unauthorized
 *       404:
 *          description: Post not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id',
  requireAuth,
  requirePermission('posts:update'),
  validateRequestParams(postIdParamsSchema),
  validateRequestBody(updatePostSchema),
  updatePost,
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Deletes a post
 *     details: Delete the post with the specified id in the database
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the post to be deleted
 *     responses:
 *       200:
 *         description: Deleted Successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server
 */
router.delete(
  '/:id',
  requireAuth,
  requirePermission('posts:delete'),
  validateRequestParams(postIdParamsSchema),
  deletePost,
);

export default router;
