import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { useCreatePost } from '../hooks/useCreatePost';
import { useUpdatePost } from '../hooks/useUpdatePost';
import { postFormSchema, type PostFormValues } from '../schemas/postSchema';
import type { Post } from '../types/postTypes';

interface PostFormProps {
  post?: Post | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PostForm({ post, onSuccess, onCancel }: PostFormProps) {
  const isEditing = Boolean(post);
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const isPending = isCreating || isUpdating;

  const submitText = isEditing ? 'Save Changes' : 'Publish Post';
  const pendingText = isEditing ? 'Saving...' : 'Publishing...';

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
    },
  });

  function onSubmit(data: PostFormValues) {
    if (post) {
      updatePost(
        { id: post.id, data },
        {
          onSuccess: () => {
            onSuccess();
          },
        },
      );
      return;
    }

    createPost(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      <FieldGroup>
        <Controller
          name='title'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='post-title'>Title</FieldLabel>
              <Input
                {...field}
                id='post-title'
                placeholder='Post title'
                disabled={isPending}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='content'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='post-content'>Content</FieldLabel>
              <Textarea
                {...field}
                id='post-content'
                placeholder='What would you like to share?'
                rows={5}
                disabled={isPending}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className='flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isPending} className='gap-1.5'>
          {isPending && <Loader2 className='size-4 animate-spin' />}
          <span>{isPending ? pendingText : submitText}</span>
        </Button>
      </div>
    </form>
  );
}
