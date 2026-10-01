import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'Something went wrong while fetching this information.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-8 text-center',
        className,
      )}
    >
      <div className='flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
        <AlertCircle className='size-5' />
      </div>
      <div className='space-y-1'>
        <p className='text-sm font-semibold text-foreground'>{title}</p>
        <p className='max-w-sm text-xs text-muted-foreground'>{message}</p>
      </div>
      {onRetry && (
        <Button
          variant='outline'
          size='sm'
          onClick={onRetry}
          className='mt-2 gap-1.5'
        >
          <RotateCcw className='size-3.5' />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}
