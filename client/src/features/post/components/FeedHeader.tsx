import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateEditPostDialog } from './CreateEditPostDialog';

export function FeedHeader() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
          Community Feed
        </h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Browse and read posts shared by the community.
        </p>
      </div>

      <div>
        <Button onClick={() => setCreateOpen(true)} className='gap-2 shrink-0'>
          <Plus className='size-4' />
          <span>New Post</span>
        </Button>
        <CreateEditPostDialog open={createOpen} onOpenChange={setCreateOpen} />
      </div>
    </div>
  );
}

