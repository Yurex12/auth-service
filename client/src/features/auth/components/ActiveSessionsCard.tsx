import { Navigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useSessions } from '../hooks/useSessions';
import { useRevokeOtherSessions } from '../hooks/useRevokeOtherSessions';
import { useRevokeAllSessions } from '../hooks/useRevokeAllSessions';
import { ActiveSessionList } from './ActiveSessionList';

export function ActiveSessionsCard() {
  const { data, isPending, isError, error, refetch } = useSessions();
  const { mutate: revokeOtherSessions, isPending: isRevokingOthers } =
    useRevokeOtherSessions();
  const { mutate: revokeAllSessions, isPending: isRevokingAll } =
    useRevokeAllSessions();

  if (isPending) {
    return (
      <Card className='shadow-sm'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='size-5 text-primary' />
            <CardTitle className='text-xl'>Active Sessions</CardTitle>
          </div>
          <CardDescription className='mt-1'>
            Devices and browsers currently signed in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState message='Loading active sessions...' />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className='shadow-sm'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='size-5 text-primary' />
            <CardTitle className='text-xl'>Active Sessions</CardTitle>
          </div>
          <CardDescription className='mt-1'>
            Devices and browsers currently signed in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title='Could not load active sessions'
            message={
              error instanceof Error ? error.message : 'Please try again.'
            }
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  const sessions = data.sessions;

  if (sessions.length === 0) return <Navigate to='/login' replace />;

  const otherSessionsCount = sessions.filter((s) => !s.currentSession).length;

  return (
    <Card className='shadow-sm'>
      <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='size-5 text-primary' />
            <CardTitle className='text-xl'>Active Sessions</CardTitle>
          </div>
          <CardDescription className='mt-1'>
            Devices and browsers currently signed in to your account.
          </CardDescription>
        </div>

        {otherSessionsCount > 0 && (
          <ConfirmDialog
            title='Sign Out Other Devices?'
            description='This will revoke all other active sessions across your other devices and browsers. Only your current session will remain signed in.'
            confirmText='Sign Out Other Devices'
            variant='destructive'
            onConfirm={() => revokeOtherSessions()}
            trigger={
              <Button
                variant='outline'
                size='sm'
                disabled={isRevokingOthers}
                className='gap-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive'
              >
                {isRevokingOthers ? (
                  <Loader2 className='size-3.5 animate-spin' />
                ) : (
                  <LogOut className='size-3.5' />
                )}
                <span>Sign Out Other Devices ({otherSessionsCount})</span>
              </Button>
            }
          />
        )}
      </CardHeader>

      <CardContent>
        <ActiveSessionList sessions={sessions} />

        {/* Global Sign Out Everywhere option */}
        <div className='mt-6 border-t pt-4 flex justify-end'>
          <ConfirmDialog
            title='Sign Out of All Sessions?'
            description='This will log you out across ALL devices, including this one. You will need to sign in again.'
            confirmText='Sign Out Everywhere'
            variant='destructive'
            onConfirm={() => revokeAllSessions()}
            trigger={
              <Button
                variant='ghost'
                size='sm'
                disabled={isRevokingAll}
                className='gap-1.5 text-xs text-muted-foreground hover:text-destructive'
              >
                {isRevokingAll ? (
                  <Loader2 className='size-3.5 animate-spin' />
                ) : (
                  <LogOut className='size-3.5' />
                )}
                <span>Sign out of all sessions everywhere</span>
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
