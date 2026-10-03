import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  BadgeCheck,
  Calendar,
  KeyRound,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCurrentUser } from '@/features/auth';
import { formatDate } from '@/lib/utils';

export function ProfilePage() {
  const { data } = useCurrentUser();
  const user = data?.user;

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const roleName = user.role.name;
  const isAdmin = roleName.toLowerCase() === 'admin';

  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
          My Profile
        </h1>
        <p className='mt-2 text-muted-foreground'>
          Manage your account profile, role, and identity information.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Main Identity Card */}
        <Card className='shadow-sm'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-4'>
              <div className='flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary'>
                {initials}
              </div>
              <div className='space-y-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <CardTitle className='text-2xl font-bold'>
                    {user.name}
                  </CardTitle>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      isAdmin
                        ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {roleName}
                  </span>
                </div>
                <CardDescription className='flex items-center gap-1.5 text-sm'>
                  <Mail className='size-3.5' />
                  <span>{user.email}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className='pt-2'>
            <div className='divide-y text-sm'>
              <div className='flex items-center justify-between py-3'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <User className='size-4' />
                  <span>Account Status</span>
                </div>
                {user.verifiedAt ? (
                  <span className='inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400'>
                    <BadgeCheck className='size-4' />
                    Verified
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400'>
                    <ShieldAlert className='size-4' />
                    Pending Verification
                  </span>
                )}
              </div>

              <div className='flex items-center justify-between py-3'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Shield className='size-4' />
                  <span>User Role</span>
                </div>
                <span className='font-mono font-medium capitalize'>
                  {roleName}
                </span>
              </div>

              <div className='flex items-center justify-between py-3'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Calendar className='size-4' />
                  <span>Member Since</span>
                </div>
                <span className='font-medium'>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Quick Link Card */}
        <Card className='shadow-sm'>
          <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='flex items-center gap-2 text-primary'>
                <KeyRound className='size-4' />
                <span className='text-xs font-semibold uppercase tracking-wider'>
                  Security & Access
                </span>
              </div>
              <CardTitle className='mt-1 text-lg'>Security Settings</CardTitle>
              <CardDescription className='mt-0.5 text-xs'>
                Manage your passwords, active sessions, and linked Google
                account.
              </CardDescription>
            </div>

            <Button
              variant='outline'
              size='sm'
              asChild
              className='gap-1.5 text-xs self-start sm:self-center shrink-0'
            >
              <Link to='/settings/security'>
                <span>Go to Security</span>
                <ArrowRight className='size-3.5' />
              </Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
