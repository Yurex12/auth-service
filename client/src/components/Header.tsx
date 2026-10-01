import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser, useLogout } from '@/features/auth';

export function Header() {
  const navigate = useNavigate();
  const { data } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!data?.user) return null;

  const user = data.user;

  function handleLogout() {
    logout(undefined, {
      onSuccess: () => navigate('/login'),
    });
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
        <Link
          to='/'
          className='flex items-center gap-2.5 font-bold tracking-tight transition-opacity hover:opacity-90'
        >
          <div className='flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm'>
            <ShieldCheck className='size-5' />
          </div>
          <span className='text-lg font-semibold tracking-tight'>
            AuthService
          </span>
        </Link>

        <div className='flex items-center gap-3 sm:gap-4'>
          <span className='hidden text-sm text-muted-foreground sm:inline'>
            Signed in as{' '}
            <strong className='font-medium text-foreground'>{user.name}</strong>
          </span>

          <Button variant='ghost' size='sm' asChild className='gap-1.5'>
            <Link to='/settings/security'>
              <ShieldCheck className='size-4' />
              <span className='hidden sm:inline'>Security</span>
            </Link>
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={handleLogout}
            disabled={isLoggingOut}
            className='gap-1.5'
          >
            {isLoggingOut ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <LogOut className='size-4' />
            )}
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
