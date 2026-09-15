import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { postsTable } from '../../db/schema.js';
import { AppError } from '../../utils/app-error.js';
import { postsPerPage } from './post.constant.js';
import type { CreatePostInput, UpdatePostInput } from './post.schema.js';

export const createPost = async (userId: string, data: CreatePostInput) => {
  const [post] = await db
    .insert(postsTable)
    .values({
      title: data.title,
      content: data.content,
      userId,
    })
    .returning();

  return { post };
};

export const getPosts = async (data: {
  page: number | undefined;
  limit: number | undefined;
}) => {
  const page = data.page ?? 1;
  const limit = data.limit ?? postsPerPage;

  const [posts, total] = await Promise.all([
    db.query.postsTable.findMany({
      orderBy: (post, { desc }) => [desc(post.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      limit,
      offset: (page - 1) * limit,
    }),
    db.$count(postsTable),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const getPostById = async (postId: string) => {
  const post = await db.query.postsTable.findFirst({
    where: (post, { eq }) => eq(post.id, postId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!post) throw new AppError('Post not found', 404);

  return { post };
};

export const updatePost = async ({
  postId,
  userId,
  role,
  data,
}: {
  postId: string;
  userId: string;
  role: string;
  data: UpdatePostInput;
}) => {
  const conditions =
    role === 'admin'
      ? eq(postsTable.id, postId)
      : and(eq(postsTable.id, postId), eq(postsTable.userId, userId));

  const [updatedPost] = await db
    .update(postsTable)
    .set(data)
    .where(conditions)
    .returning();

  if (!updatedPost) throw new AppError('Post not found', 404);
  return { post: updatedPost };
};

export const deletePost = async ({
  postId,
  userId,
  role,
}: {
  postId: string;
  userId: string;
  role: string;
}) => {
  const conditions =
    role === 'admin'
      ? eq(postsTable.id, postId)
      : and(eq(postsTable.id, postId), eq(postsTable.userId, userId));

  const [deletedPost] = await db
    .delete(postsTable)
    .where(conditions)
    .returning({ id: postsTable.id });

  if (!deletedPost) throw new AppError('Post not found', 404);
};
