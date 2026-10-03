import { Trash2, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Post } from '../types/postTypes';

interface PostItemProps {
  post: Post;
  currentUserId?: string;
  isAdmin?: boolean;
  onSelectDelete: (post: Post) => void;
}

export function PostItem({
  post,
  currentUserId,
  isAdmin,
  onSelectDelete,
}: PostItemProps) {
  const canDelete = isAdmin || (currentUserId && currentUserId === post.userId);

  return (
    <Card className='flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <CardTitle className='text-lg font-semibold leading-snug text-foreground'>
            {post.title}
          </CardTitle>
          {canDelete && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onSelectDelete(post)}
              className='size-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0'
              title='Delete post'
            >
              <Trash2 className='size-4' />
              <span className='sr-only'>Delete post</span>
            </Button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <User className='size-3.5' />
            <span className='font-medium text-foreground/80'>
              {post.user.name}
            </span>
          </div>
          <span>•</span>
          <div className='flex items-center gap-1'>
            <Clock className='size-3.5' />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        <p className='whitespace-pre-line text-sm text-muted-foreground leading-relaxed'>
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
