import { useState } from 'react';
import type { SessionItem } from '../types/authTypes';
import { ActiveSessionItem } from './ActiveSessionItem';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useRevokeSession } from '../hooks/useRevokeSession';
import { parseUserAgent } from '../utils/sessionParser';

interface ActiveSessionListProps {
  sessions: SessionItem[];
}

export function ActiveSessionList({ sessions }: ActiveSessionListProps) {
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(
    null,
  );
  const { mutate: revokeSession, isPending } = useRevokeSession();

  return (
    <>
      <div className='divide-y rounded-lg border bg-card'>
        {sessions.map((session) => (
          <ActiveSessionItem
            key={session.id}
            session={session}
            onSelectRevoke={setSelectedSession}
          />
        ))}
      </div>

      {selectedSession && (
        <ConfirmDialog
          open={!!selectedSession}
          onOpenChange={(open) => (!open ? setSelectedSession(null) : null)}
          title='Revoke Session?'
          description={
            <>
              Are you sure you want to sign out this session on{' '}
              <strong className='font-semibold text-foreground'>
                {parseUserAgent(selectedSession.userAgent).browser} on{' '}
                {parseUserAgent(selectedSession.userAgent).os}
              </strong>
              ? That device will be required to sign in again.
            </>
          }
          confirmText={isPending ? 'Revoking...' : 'Revoke Session'}
          variant='destructive'
          isLoading={isPending}
          onConfirm={() => {
            revokeSession(selectedSession.id, {
              onSettled: () => setSelectedSession(null),
            });
          }}
        />
      )}
    </>
  );
}
