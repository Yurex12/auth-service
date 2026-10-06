import { usePosts, PostList, FeedHeader } from '@/features/post';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

export function HomePage() {
  const {
    data: postsData,
    isPending: isPendingPosts,
    isError: isErrorPosts,
    error: postsError,
    refetch: refetchPosts,
  } = usePosts();

  if (isPendingPosts) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
        <FeedHeader />
        <Card className='shadow-sm'>
          <CardContent className='p-8'>
            <LoadingState message='Loading posts...' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isErrorPosts) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
        <FeedHeader />
        <Card className='shadow-sm'>
          <CardContent className='p-8'>
            <ErrorState
              title='Could not load posts'
              message={postsError.message}
              onRetry={() => refetchPosts()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { posts } = postsData;

  if (posts.length === 0) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
        <FeedHeader />
        <Card className='border-dashed shadow-sm'>
          <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
            <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
              <FileText className='size-6 text-muted-foreground' />
            </div>
            <p className='mt-3 font-semibold text-foreground'>No posts yet</p>
            <p className='mt-1 text-xs text-muted-foreground max-w-xs'>
              There are no posts published yet. Once posts are created, they
              will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
      <FeedHeader />
      <PostList posts={posts} />
    </div>
  );
}
