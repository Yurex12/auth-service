import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldAlert,
  Unlink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { GoogleIcon } from './GoogleIcon';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useUserAccounts } from '../hooks/useUserAccounts';
import { useUnlinkGoogle } from '../hooks/useUnlinkGoogle';
import { authKeys } from '../hooks/authKeys';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

export function ConnectedAccountsCard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { data: userData } = useCurrentUser();
  const {
    data: accountsData,
    isPending,
    isError,
    error,
    refetch,
  } = useUserAccounts();
  const { mutate: unlinkGoogle, isPending: isUnlinking } = useUnlinkGoogle();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const googleStatus = searchParams.get('google');
    const errorParam = searchParams.get('error');

    if (googleStatus === 'linked') {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      toast.success('Google account linked successfully!', {
        id: 'google-linked-success',
      });
      searchParams.delete('google');
      setSearchParams(searchParams, { replace: true });
    } else if (errorParam) {
      toast.error(errorParam, {
        id: 'google-link-error',
      });
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient]);

  function handleConnectGoogle() {
    setIsRedirecting(true);
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google/link`;
  }

  if (isPending) {
    return (
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl'>Connected Accounts</CardTitle>
          <CardDescription>
            Manage authentication providers and sign-in methods linked to your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState message='Loading connected accounts...' />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl'>Connected Accounts</CardTitle>
          <CardDescription>
            Manage authentication providers and sign-in methods linked to your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorState
            title='Could not load connected accounts'
            message={
              error instanceof Error ? error.message : 'Please try again.'
            }
            onRetry={() => refetch()}
          />
        </CardContent>
      </Card>
    );
  }

  const user = userData?.user;
  const accounts = accountsData?.accounts ?? [];

  const isGoogleLinked = accounts.some(
    (account) => account.providerId === 'google',
  );
  const isCredentialLinked = accounts.some(
    (account) => account.providerId === 'credential',
  );

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Connected Accounts</CardTitle>
        <CardDescription>
          Manage authentication providers and sign-in methods linked to your
          account.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Notice when connecting Google */}
        {!isGoogleLinked && user && (
          <div className='flex gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200'>
            <AlertCircle className='size-4 shrink-0 text-amber-600 dark:text-amber-400' />
            <span>
              When connecting Google, the Google account email must match your
              registered email (
              <strong className='font-semibold'>{user.email}</strong>).
            </span>
          </div>
        )}

        {/* Notice when Google is only login method */}
        {isGoogleLinked && !isCredentialLinked && (
          <div className='flex gap-2.5 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-900 dark:text-blue-200'>
            <AlertCircle className='size-4 shrink-0 text-blue-600 dark:text-blue-400' />
            <span>
              Google is currently your only sign-in method. You must configure a
              password before you can disconnect Google.
            </span>
          </div>
        )}

        <div className='divide-y rounded-lg border bg-card'>
          {/* Google Provider Row */}
          <div className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3.5'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 shadow-xs'>
                <GoogleIcon className='size-5' />
              </div>
              <div>
                <p className='text-sm font-semibold text-foreground'>Google</p>
                <p className='text-xs text-muted-foreground'>
                  {isGoogleLinked
                    ? `Connected as ${user?.email}`
                    : 'Not connected — link for one-click Google login'}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {isGoogleLinked ? (
                <>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                    <CheckCircle2 className='size-3.5' />
                    Connected
                  </span>

                  {isCredentialLinked && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size='sm'
                          variant='outline'
                          disabled={isUnlinking}
                          className='gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive'
                        >
                          {isUnlinking ? (
                            <Loader2 className='size-3.5 animate-spin' />
                          ) : (
                            <Unlink className='size-3.5' />
                          )}
                          <span>Disconnect</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Disconnect Google Account?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to disconnect your Google
                            account? You will still be able to sign in using
                            your email and password.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => unlinkGoogle()}
                            className='bg-destructive text-white hover:bg-destructive/90 shadow-sm'
                          >
                            Disconnect Google
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </>
              ) : (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleConnectGoogle}
                  disabled={isRedirecting}
                  className='gap-2'
                >
                  {isRedirecting ? (
                    <Loader2 className='size-3.5 animate-spin' />
                  ) : (
                    <GoogleIcon className='size-3.5' />
                  )}
                  <span>
                    {isRedirecting ? 'Redirecting...' : 'Connect Google'}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {/* Email & Password Provider Row */}
          <div className='flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3.5'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40 shadow-xs'>
                <KeyRound className='size-5 text-muted-foreground' />
              </div>
              <div>
                <p className='text-sm font-semibold text-foreground'>
                  Email & Password
                </p>
                <p className='text-xs text-muted-foreground'>
                  {isCredentialLinked
                    ? `Active for ${user?.email}`
                    : 'No password configured'}
                </p>
              </div>
            </div>

            <div>
              {isCredentialLinked ? (
                <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                  <CheckCircle2 className='size-3.5' />
                  Active
                </span>
              ) : (
                <span className='inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground'>
                  <ShieldAlert className='size-3.5' />
                  None
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
