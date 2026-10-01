import { Link } from 'react-router-dom';
import { useCurrentUser, useUserAccounts, GoogleIcon } from '@/features/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BadgeCheck, User, Mail, Shield, Link2, AlertCircle } from 'lucide-react';

export function HomePage() {
  const { data } = useCurrentUser();
  const {
    data: accountsData,
    isPending: isPendingAccounts,
    isError: isErrorAccounts,
    refetch: refetchAccounts,
  } = useUserAccounts();
  const user = data?.user;
  const accounts = accountsData?.accounts ?? [];
  const isGoogleLinked = accounts.some(
    (account) => account.providerId === 'google',
  );

  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
      <div className='mb-8 text-center sm:text-left'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className='mt-2 text-muted-foreground'>
          You are authenticated. Here are your account details.
        </p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2'>
        <Card className='shadow-sm'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <User className='size-4' />
              <span className='text-xs font-semibold uppercase tracking-wider'>
                Profile Details
              </span>
            </div>
            <CardTitle className='text-xl'>{user?.name}</CardTitle>
            <CardDescription className='flex items-center gap-1.5'>
              <Mail className='size-3.5' />
              <span>{user?.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-2 text-sm'>
            <div className='flex items-center justify-between border-t py-2.5'>
              <span className='text-muted-foreground'>Account Status</span>
              <span className='inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400'>
                <BadgeCheck className='size-4' />
                {user?.verifiedAt ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
            <div className='flex items-center justify-between border-t py-2.5'>
              <span className='text-muted-foreground'>Member Since</span>
              <span className='font-medium'>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Shield className='size-4' />
              <span className='text-xs font-semibold uppercase tracking-wider'>
                Session & Security
              </span>
            </div>
            <CardTitle className='text-xl'>Security Overview</CardTitle>
            <CardDescription>
              Your session is active and secured with HttpOnly cookies.
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-2 text-sm'>
            <div className='flex items-center justify-between border-t py-2.5'>
              <span className='text-muted-foreground'>Authentication</span>
              <span className='font-medium'>Active Session</span>
            </div>
            <div className='flex items-center justify-between border-t py-2.5'>
              <span className='text-muted-foreground'>Role</span>
              <span className='font-mono text-xs uppercase tracking-wider'>
                {user?.role?.name || user?.roleId || 'user'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm sm:col-span-2'>
          <CardHeader className='pb-3'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Link2 className='size-4' />
              <span className='text-xs font-semibold uppercase tracking-wider'>
                Connected Accounts
              </span>
            </div>
            <CardTitle className='text-xl'>Linked Providers</CardTitle>
            <CardDescription>
              Manage third-party authentication providers connected to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-2 text-sm'>
            {isPendingAccounts ? (
              <div className='flex items-center justify-between border-t py-3.5'>
                <div className='flex items-center gap-3'>
                  <div className='size-8 animate-pulse rounded-lg bg-muted' />
                  <div className='space-y-1.5'>
                    <div className='h-4 w-24 animate-pulse rounded bg-muted' />
                    <div className='h-3 w-56 animate-pulse rounded bg-muted' />
                  </div>
                </div>
                <div className='h-7 w-24 animate-pulse rounded-md bg-muted' />
              </div>
            ) : isErrorAccounts ? (
              <div className='flex items-center justify-between border-t py-3'>
                <div className='flex items-center gap-2 text-xs text-destructive'>
                  <AlertCircle className='size-4 shrink-0' />
                  <span>Failed to load account connections</span>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => refetchAccounts()}
                  className='text-xs'
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className='flex items-center justify-between border-t py-3'>
                <div className='flex items-center gap-3'>
                  <GoogleIcon className='size-5' />
                  <div>
                    <p className='font-medium text-foreground'>Google</p>
                    <p className='text-xs text-muted-foreground'>
                      {isGoogleLinked
                        ? 'Connected — you can use Google to sign in to this account'
                        : 'Not connected — link your Google account for faster sign-in'}
                    </p>
                  </div>
                </div>
                <div>
                  {isGoogleLinked ? (
                    <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                      <BadgeCheck className='size-3.5' />
                      Linked
                    </span>
                  ) : (
                    <Button variant='outline' size='sm' asChild>
                      <Link to='/settings/security' className='gap-1.5'>
                        <GoogleIcon className='size-3.5' />
                        Connect in Security
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
