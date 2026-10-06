import * as z from 'zod';

export const postFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
