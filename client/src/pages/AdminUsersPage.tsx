import { useSearchParams, Navigate } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth';
import { useUsers, UserList } from '@/features/user';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users as UsersIcon } from 'lucide-react';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function AdminUsersHeader() {
  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
        User Management
      </h1>
      <p className='mt-1 text-sm text-muted-foreground'>
        Manage registered user accounts, assign roles, and administer permissions.
      </p>
    </div>
  );
}

function getPageItems(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ];
}

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page')) || 1;
  const currentPage = Math.max(1, pageParam);

  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData?.user;

  const {
    data: usersData,
    isPending: isPendingUsers,
    isError: isErrorUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers({ page: currentPage });

  function handlePageChange(newPage: number) {
    if (newPage === currentPage || newPage < 1) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(newPage));
      }
      return next;
    });
  }

  if (!currentUser) return null;

  if (currentUser.role.name.toLowerCase() !== 'admin') {
    return <Navigate to='/' replace />;
  }

  if (isPendingUsers) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
        <AdminUsersHeader />
        <Card className='shadow-sm'>
          <CardContent className='p-8'>
            <LoadingState message='Loading users...' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isErrorUsers) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
        <AdminUsersHeader />
        <Card className='shadow-sm'>
          <CardContent className='p-8'>
            <ErrorState
              title='Could not load users'
              message={usersError.message}
              onRetry={() => refetchUsers()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { users, pagination } = usersData;

  if (users.length === 0) {
    if (currentPage > 1) {
      return (
        <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
          <AdminUsersHeader />
          <Card className='border-dashed shadow-sm'>
            <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
              <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
                <UsersIcon className='size-6 text-muted-foreground' />
              </div>
              <p className='mt-3 font-semibold text-foreground'>
                No users found on page {currentPage}
              </p>
              <p className='mt-1 text-xs text-muted-foreground max-w-xs'>
                This page has no records. You might want to return to the first page.
              </p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(1)}
                className='mt-4'
              >
                Go to page 1
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
        <AdminUsersHeader />
        <Card className='border-dashed shadow-sm'>
          <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
            <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
              <UsersIcon className='size-6 text-muted-foreground' />
            </div>
            <p className='mt-3 font-semibold text-foreground'>No users found</p>
            <p className='mt-1 text-xs text-muted-foreground max-w-xs'>
              There are currently no registered users in the database.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fromCount = (pagination.page - 1) * pagination.limit + 1;
  const toCount = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
      <AdminUsersHeader />
      <div className='space-y-6'>
        <UserList users={users} currentUserId={currentUser.id} />

        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-2'>
          <p className='text-xs text-muted-foreground order-2 sm:order-1'>
            Showing <span className='font-medium text-foreground'>{fromCount}</span> to{' '}
            <span className='font-medium text-foreground'>{toCount}</span> of{' '}
            <span className='font-medium text-foreground'>{pagination.total}</span> users
          </p>

          {pagination.totalPages > 1 && (
            <div className='order-1 sm:order-2'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    />
                  </PaginationItem>

                  {getPageItems(currentPage, pagination.totalPages).map((item, index) => (
                    <PaginationItem key={index}>
                      {item === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={item === currentPage}
                          onClick={() => handlePageChange(item)}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= pagination.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

