import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostForm } from './PostForm';
import type { Post } from '../types/postTypes';

interface CreateEditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | null;
}

export function CreateEditPostDialog({
  open,
  onOpenChange,
  post,
}: CreateEditPostDialogProps) {
  const isEditing = Boolean(post);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update your post details below.'
                : 'Share your ideas, updates, or questions with the community.'}
            </DialogDescription>
          </DialogHeader>

          <PostForm
            key={post?.id ?? 'create'}
            post={post}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
