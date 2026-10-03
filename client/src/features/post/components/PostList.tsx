import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PostItem } from './PostItem';
import { useDeletePost } from '../hooks/useDeletePost';
import type { Post } from '../types/postTypes';

interface PostListProps {
  posts: Post[];
  currentUserId?: string;
  isAdmin?: boolean;
}

export function PostList({ posts, currentUserId, isAdmin }: PostListProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { mutate: deletePost, isPending } = useDeletePost();

  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2'>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onSelectDelete={setSelectedPost}
          />
        ))}
      </div>

      {selectedPost && (
        <ConfirmDialog
          open={!!selectedPost}
          onOpenChange={(open) => {
            if (!open) setSelectedPost(null);
          }}
          title='Delete Post?'
          description='Are you sure you want to delete this post? This action cannot be undone.'
          confirmText={isPending ? 'Deleting...' : 'Delete Post'}
          variant='destructive'
          isLoading={isPending}
          onConfirm={() => {
            deletePost(selectedPost.id, {
              onSettled: () => setSelectedPost(null),
            });
          }}
        />
      )}
    </>
  );
}
