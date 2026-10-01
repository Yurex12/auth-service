import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleIcon } from './GoogleIcon';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useUserAccounts } from '../hooks/useUserAccounts';
import { authKeys } from '../hooks/authKeys';

export function LinkAccountCard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { data } = useCurrentUser();
  const { data: accountsData } = useUserAccounts();
  const [isLinking, setIsLinking] = useState(false);

  const user = data?.user;
  const accounts = accountsData?.accounts ?? [];
  const isGoogleLinked = accounts.some(
    (account) => account.providerId === 'google',
  );

  useEffect(() => {
    const googleStatus = searchParams.get('google');
    const error = searchParams.get('error');

    if (googleStatus === 'linked') {
      queryClient.invalidateQueries({ queryKey: authKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      toast.success('Google account linked successfully!', {
        id: 'google-linked-success',
      });
      searchParams.delete('google');
      setSearchParams(searchParams, { replace: true });
    } else if (error) {
      toast.error(error, {
        id: 'google-link-error',
      });
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient]);

  function handleLinkGoogle() {
    setIsLinking(true);
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google/link`;
  }

  if (!user) return null;

  if (isGoogleLinked) {
    return (
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-2 text-center'>
          <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
            <CheckCircle2 className='size-6' />
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight'>
            Google Connected
          </CardTitle>
          <CardDescription>
            Your Google account is already linked to your profile.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between rounded-lg border bg-muted/40 p-4'>
            <div className='flex items-center gap-3'>
              <GoogleIcon className='size-5' />
              <div>
                <p className='text-sm font-semibold'>Google Account</p>
                <p className='text-xs text-muted-foreground'>{user.email}</p>
              </div>
            </div>
            <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
              <CheckCircle2 className='size-3' />
              Linked
            </span>
          </div>

          <p className='text-center text-xs text-muted-foreground'>
            You can sign in using either your email/password credentials or Google.
          </p>
        </CardContent>

        <CardFooter className='justify-center border-t py-4'>
          <Button variant='outline' asChild>
            <Link to='/' className='inline-flex items-center gap-2'>
              <ArrowLeft className='size-4' />
              Return to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <GoogleIcon className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Link Google Account
        </CardTitle>
        <CardDescription>
          Connect your Google account to enable quick one-click sign in.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='rounded-lg border bg-muted/30 p-3.5 text-sm'>
          <span className='text-muted-foreground'>Signed in as:</span>
          <p className='font-semibold text-foreground'>{user.email}</p>
        </div>

        <div className='flex gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200'>
          <AlertCircle className='size-4 shrink-0 text-amber-600 dark:text-amber-400' />
          <span>
            The Google account email must match your current signed-in email (
            <strong className='font-semibold'>{user.email}</strong>).
          </span>
        </div>

        <Button
          type='button'
          className='w-full gap-2'
          onClick={handleLinkGoogle}
          disabled={isLinking}
        >
          {isLinking ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <GoogleIcon className='size-4' />
          )}
          <span>{isLinking ? 'Redirecting to Google...' : 'Link with Google'}</span>
        </Button>
      </CardContent>

      <CardFooter className='justify-center border-t py-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link to='/' className='inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground'>
            <ArrowLeft className='size-4' />
            Cancel and Return
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
