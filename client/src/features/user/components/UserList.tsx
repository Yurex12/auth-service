import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { UserItem } from './UserItem';
import { useUpdateUserRole } from '../hooks/useUpdateUserRole';
import { useDeleteUser } from '../hooks/useDeleteUser';
import type { User } from '../types/userTypes';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  const [selectedDeleteUserId, setSelectedDeleteUserId] = useState<string | null>(null);
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  function handleRoleChange(userId: string, roleName: string) {
    updateRole({ id: userId, data: { roleName } });
  }

  return (
    <>
      <Card className='shadow-sm overflow-hidden'>
        <CardContent className='p-0 divide-y'>
          {users.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              onSelectDelete={setSelectedDeleteUserId}
              onRoleChange={handleRoleChange}
              isUpdatingRole={isUpdatingRole}
            />
          ))}
        </CardContent>
      </Card>

      {selectedDeleteUserId && (
        <ConfirmDialog
          open={Boolean(selectedDeleteUserId)}
          onOpenChange={(open) => (!open ? setSelectedDeleteUserId(null) : null)}
          title='Delete User Account?'
          description='Are you sure you want to delete this user? Their account, sessions, and posts will be permanently removed. This action cannot be undone.'
          confirmText={isDeleting ? 'Deleting...' : 'Delete User'}
          variant='destructive'
          isLoading={isDeleting}
          onConfirm={() => {
            deleteUser(selectedDeleteUserId, {
              onSettled: () => setSelectedDeleteUserId(null),
            });
          }}
        />
      )}
    </>
  );
}
