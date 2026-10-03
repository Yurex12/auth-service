import type { ApiResponse } from '@/types/apiTypes';

export type PostAuthor = {
  id: string;
  name: string;
  email: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: PostAuthor;
};

export type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PostsResponse = ApiResponse & {
  posts: Post[];
  pagination: PaginationInfo;
};

export type PostResponse = ApiResponse & {
  post: Post;
};

export type GetPostsParams = {
  page?: number;
  limit?: number;
};

export type CreatePostInput = {
  title: string;
  content: string;
};

export type UpdatePostInput = {
  title?: string;
  content?: string;
};
