import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/apiTypes';
import type {
  CreatePostInput,
  GetPostsParams,
  PostResponse,
  PostsResponse,
  UpdatePostInput,
} from '../types/postTypes';

export const getPostsApi = async (
  params?: GetPostsParams,
): Promise<PostsResponse> => {
  const response = await apiClient.get<PostsResponse>('/posts', { params });
  return response.data;
};

export const getPostApi = async (id: string): Promise<PostResponse> => {
  const response = await apiClient.get<PostResponse>(`/posts/${id}`);
  return response.data;
};

export const createPostApi = async (
  data: CreatePostInput,
): Promise<PostResponse> => {
  const response = await apiClient.post<PostResponse>('/posts', data);
  return response.data;
};

export const updatePostApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdatePostInput;
}): Promise<PostResponse> => {
  const response = await apiClient.patch<PostResponse>(`/posts/${id}`, data);
  return response.data;
};

export const deletePostApi = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/posts/${id}`);
  return response.data;
};
