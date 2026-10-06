import { useState } from 'react';
import { useCurrentUser } from '@/features/auth';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PostItem } from './PostItem';
import { CreateEditPostDialog } from './CreateEditPostDialog';
import { useDeletePost } from '../hooks/useDeletePost';
import type { Post } from '../types/postTypes';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const { data } = useCurrentUser();
  const user = data?.user;

  const [selectedPostDeleteId, setSelectedPostDeleteId] = useState<string | null>(null);
  const [selectedEditPost, setSelectedEditPost] = useState<Post | null>(null);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  if (!user) return null;

  const currentUserId = user.id;
  const isAdmin = user.role.name.toLowerCase() === 'admin';

  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2'>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onSelectEdit={setSelectedEditPost}
            onSelectDelete={setSelectedPostDeleteId}
          />
        ))}
      </div>

      {selectedPostDeleteId && (
        <ConfirmDialog
          open={Boolean(selectedPostDeleteId)}
          onOpenChange={(open) => (!open ? setSelectedPostDeleteId(null) : null)}
          title='Delete Post?'
          description='Are you sure you want to delete this post? This action cannot be undone.'
          confirmText={isDeleting ? 'Deleting...' : 'Delete Post'}
          variant='destructive'
          isLoading={isDeleting}
          onConfirm={() => {
            deletePost(selectedPostDeleteId, {
              onSettled: () => setSelectedPostDeleteId(null),
            });
          }}
        />
      )}

      {selectedEditPost && (
        <CreateEditPostDialog
          post={selectedEditPost}
          open={Boolean(selectedEditPost)}
          onOpenChange={(open) => (!open ? setSelectedEditPost(null) : null)}
        />
      )}
    </>
  );
}
