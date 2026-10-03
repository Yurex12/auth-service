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

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;
