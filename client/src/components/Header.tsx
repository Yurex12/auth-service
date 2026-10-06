import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  Loader2,
  FileText,
  User,
  Users,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUser, useLogout } from '@/features/auth';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { data } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (!data?.user) return null;

  const user = data.user;
  const isAdmin = user.role.name.toLowerCase() === 'admin';

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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

          {/* Desktop Navigation Links */}
          <nav className='hidden md:flex items-center gap-6'>
            <NavLink to='/' end className={navLinkClass}>
              <FileText className='size-4' />
              <span>Posts</span>
            </NavLink>

            {isAdmin && (
              <NavLink to='/admin/users' className={navLinkClass}>
                <Users className='size-4' />
                <span>Users</span>
              </NavLink>
            )}

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

        <div className='flex items-center gap-2 sm:gap-4'>
          <span className='hidden text-xs text-muted-foreground lg:inline'>
            Signed in as{' '}
            <strong className='font-medium text-foreground'>{user.name}</strong>
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={handleLogout}
            disabled={isLoggingOut}
            className='hidden md:inline-flex gap-1.5 text-xs'
          >
            {isLoggingOut ? (
              <Loader2 className='size-3.5 animate-spin' />
            ) : (
              <LogOut className='size-3.5' />
            )}
            <span>Log out</span>
          </Button>

          {/* Mobile Navigation Sheet */}
          <Sheet
            open={isOpen}
            onOpenChange={(open) => (open ? setIsOpen(true) : setIsOpen(false))}
          >
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden size-9 text-muted-foreground hover:text-foreground'
                aria-label='Toggle navigation menu'
              >
                <Menu className='size-5' />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='flex flex-col justify-between w-80 sm:w-88 p-6'
            >
              <div className='space-y-6'>
                <SheetHeader className='text-left pb-4 border-b space-y-1'>
                  <div className='flex items-center gap-2.5'>
                    <div className='flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs'>
                      <ShieldCheck className='size-4.5' />
                    </div>
                    <div>
                      <SheetTitle className='text-base font-bold'>
                        AuthService
                      </SheetTitle>
                      <SheetDescription className='text-xs text-muted-foreground'>
                        Navigation menu
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                {/* User Info Card in Mobile Menu */}
                <div className='flex items-center gap-3 rounded-lg border bg-muted/40 p-3'>
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary'>
                    {userInitials}
                  </div>
                  <div className='min-w-0 flex-1 space-y-0.5'>
                    <div className='flex items-center gap-1.5'>
                      <p className='truncate text-sm font-semibold text-foreground'>
                        {user.name}
                      </p>
                      {isAdmin && (
                        <span className='rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase'>
                          Admin
                        </span>
                      )}
                    </div>
                    <p className='truncate text-xs text-muted-foreground'>
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <nav className='flex flex-col gap-1'>
                  <NavLink
                    to='/'
                    end
                    className={mobileNavLinkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className='size-4' />
                    <span>Posts Feed</span>
                  </NavLink>

                  {isAdmin && (
                    <NavLink
                      to='/admin/users'
                      className={mobileNavLinkClass}
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className='size-4' />
                      <span>User Management</span>
                    </NavLink>
                  )}

                  <NavLink
                    to='/profile'
                    className={mobileNavLinkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    <User className='size-4' />
                    <span>My Profile</span>
                  </NavLink>

                  <NavLink
                    to='/settings/security'
                    className={mobileNavLinkClass}
                    onClick={() => setIsOpen(false)}
                  >
                    <ShieldCheck className='size-4' />
                    <span>Security & Sessions</span>
                  </NavLink>
                </nav>
              </div>

              <SheetFooter className='pt-4 border-t'>
                <Button
                  variant='outline'
                  size='default'
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className='w-full justify-center gap-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive'
                >
                  {isLoggingOut ? (
                    <Loader2 className='size-3.5 animate-spin' />
                  ) : (
                    <LogOut className='size-3.5' />
                  )}
                  <span>Log out</span>
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
