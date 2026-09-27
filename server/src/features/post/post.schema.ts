import * as z from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
});

export const updatePostSchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').optional(),
    content: z.string().trim().min(1, 'Content cannot be empty').optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: 'At least one field (title or content) must be provided',
  });

export const postIdParamsSchema = z.object({
  id: z.uuid().min(1, 'Id is required'),
});

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostIdParam = z.infer<typeof postIdParamsSchema>;
export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
