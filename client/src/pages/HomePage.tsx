import { useCurrentUser } from '@/features/auth';
import { usePosts, PostList } from '@/features/post';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

export function HomePage() {
  const { data: userData } = useCurrentUser();
  const {
    data: postsData,
    isPending: isPendingPosts,
    isError: isErrorPosts,
    error: postsError,
    refetch: refetchPosts,
  } = usePosts();

  const user = userData?.user;
  const posts = postsData?.posts ?? [];

  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
      <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Community Feed
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Browse and read posts shared by the community.
          </p>
        </div>
      </div>

      {isPendingPosts ? (
        <Card className='shadow-sm'>
          <CardContent className='p-8'>
            <LoadingState message='Loading posts...' />
          </CardContent>
        </Card>
      ) : isErrorPosts ? (
        <Card className='shadow-sm'>
          <CardContent className='p-8'>
            <ErrorState
              title='Could not load posts'
              message={postsError.message}
              onRetry={() => refetchPosts()}
            />
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card className='border-dashed shadow-sm'>
          <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
            <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
              <FileText className='size-6 text-muted-foreground' />
            </div>
            <p className='mt-3 font-semibold text-foreground'>No posts yet</p>
            <p className='mt-1 text-xs text-muted-foreground max-w-xs'>
              There are no posts published yet. Once posts are created, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <PostList
          posts={posts}
          currentUserId={user?.id}
          isAdmin={user?.role?.name === 'admin'}
        />
      )}
    </div>
  );
}


