import {
  Laptop,
  Smartphone,
  CheckCircle2,
  Trash2,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SessionItem } from '../types/authTypes';
import { parseUserAgent, formatSessionDate } from '../utils/sessionParser';

interface ActiveSessionItemProps {
  session: SessionItem;
  onSelectRevoke: (session: SessionItem) => void;
}

export function ActiveSessionItem({
  session,
  onSelectRevoke,
}: ActiveSessionItemProps) {
  const { browser, os, isMobile } = parseUserAgent(session.userAgent);

  return (
    <div className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'>
      {/* Device Info */}
      <div className='flex items-center gap-3.5'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground shadow-xs'>
          {isMobile ? (
            <Smartphone className='size-5' />
          ) : (
            <Laptop className='size-5' />
          )}
        </div>

        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='text-sm font-semibold text-foreground'>
              {browser} on {os}
            </p>
            {session.currentSession && (
              <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                <CheckCircle2 className='size-3.5' />
                This device
              </span>
            )}
          </div>

          <div className='mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground'>
            {session.ipAddress && (
              <span className='inline-flex items-center gap-1'>
                <Globe className='size-3' />
                {session.ipAddress}
              </span>
            )}
            {session.ipAddress && <span>•</span>}
            <span>Signed in {formatSessionDate(session.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-2'>
        {session.currentSession ? (
          <span className='text-xs font-medium text-muted-foreground'>
            Active Now
          </span>
        ) : (
          <Button
            size='sm'
            variant='outline'
            onClick={() => onSelectRevoke(session)}
            className='gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive'
          >
            <Trash2 className='size-3.5' />
            <span>Revoke</span>
          </Button>
        )}
      </div>
    </div>
  );
}
