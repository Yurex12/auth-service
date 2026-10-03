import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Loader2, FileText, User } from 'lucide-react';
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
        <div className='flex items-center gap-6 sm:gap-8'>
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

          {/* Navigation Links */}
          <nav className='flex items-center gap-4 sm:gap-6'>
            <NavLink to='/' end className={navLinkClass}>
              <FileText className='size-4' />
              <span>Posts</span>
            </NavLink>

            <NavLink to='/profile' className={navLinkClass}>
              <User className='size-4' />
              <span>Profile</span>
            </NavLink>

            <NavLink to='/settings/security' className={navLinkClass}>
              <ShieldCheck className='size-4' />
              <span>Security</span>
            </NavLink>
          </nav>
        </div>

        <div className='flex items-center gap-3 sm:gap-4'>
          <span className='hidden text-xs text-muted-foreground lg:inline'>
            Signed in as{' '}
            <strong className='font-medium text-foreground'>{user.name}</strong>
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={handleLogout}
            disabled={isLoggingOut}
            className='gap-1.5 text-xs'
          >
            {isLoggingOut ? (
              <Loader2 className='size-3.5 animate-spin' />
            ) : (
              <LogOut className='size-3.5' />
            )}
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
