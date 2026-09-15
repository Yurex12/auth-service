import type { Request, Response } from 'express';
import type { TypedRequest } from '../../types/express.js';
import type {
  CreatePostInput,
  GetPostsQuery,
  PostIdParam,
  UpdatePostInput,
} from './post.schema.js';
import {
  createPost as createPostService,
  deletePost as deletePostService,
  getPostById as getPostByIdService,
  getPosts as getPostsService,
  updatePost as updatePostService,
} from './post.service.js';

export const getPosts = async (
  req: TypedRequest<unknown, Record<string, string>, GetPostsQuery>,
  res: Response,
) => {
  const { posts, pagination } = await getPostsService({
    page: req.query.page,
    limit: req.query.limit,
  });

  res.json({
    success: true,
    message: 'Posts fetched successfully',
    posts,
    pagination,
  });
};

export const getPost = async (
  req: TypedRequest<unknown, PostIdParam>,
  res: Response,
) => {
  const { post } = await getPostByIdService(req.params.id);

  res.json({
    success: true,
    message: 'Post fetched successfully',
    post,
  });
};

export const createPost = async (
  req: TypedRequest<CreatePostInput>,
  res: Response,
) => {
  const { post } = await createPostService(req.userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post,
  });
};

export const updatePost = async (
  req: TypedRequest<UpdatePostInput, PostIdParam>,
  res: Response,
) => {
  const { post } = await updatePostService({
    postId: req.params.id,
    userId: req.userId,
    role: req.user.role.name,
    data: req.body,
  });

  res.json({
    success: true,
    message: 'Post updated successfully',
    post,
  });
};

export const deletePost = async (
  req: TypedRequest<unknown, PostIdParam>,
  res: Response,
) => {
  await deletePostService({
    postId: req.params.id,
    userId: req.userId,
    role: req.user.role.name,
  });

  res.json({
    success: true,
    message: 'Post deleted successfully',
  });
};
