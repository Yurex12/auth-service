import { Trash2, BadgeCheck, ShieldAlert, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import type { User } from '../types/userTypes';

interface UserItemProps {
  user: User;
  currentUserId: string;
  onSelectDelete: (id: string) => void;
  onRoleChange: (id: string, roleName: string) => void;
  isUpdatingRole?: boolean;
}

export function UserItem({
  user,
  currentUserId,
  onSelectDelete,
  onRoleChange,
  isUpdatingRole = false,
}: UserItemProps) {
  const isSelf = currentUserId === user.id;
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const roleName = user.role.name.toLowerCase();

  return (
    <div className='flex flex-col gap-4 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-3.5 min-w-0'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary'>
          {initials}
        </div>
        <div className='min-w-0 space-y-0.5'>
          <div className='flex items-center gap-2'>
            <span className='font-semibold text-foreground truncate'>
              {user.name}
            </span>
            {isSelf && (
              <span className='inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider'>
                You
              </span>
            )}
            {user.verifiedAt ? (
              <span title='Verified Account' className='text-emerald-600 dark:text-emerald-400'>
                <BadgeCheck className='size-3.5' />
              </span>
            ) : (
              <span title='Pending Verification' className='text-amber-600 dark:text-amber-400'>
                <ShieldAlert className='size-3.5' />
              </span>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground'>
            <span className='truncate'>{user.email}</span>
            <span>•</span>
            <span className='flex items-center gap-1'>
              <Calendar className='size-3' />
              <span>Joined {formatDate(user.createdAt)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-3 self-end sm:self-center shrink-0'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-muted-foreground font-medium'>Role:</span>
          <Select
            value={roleName}
            onValueChange={(newRole) => onRoleChange(user.id, newRole)}
            disabled={isSelf || isUpdatingRole}
          >
            <SelectTrigger className='w-28 h-8 capitalize text-xs'>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='user'>User</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isSelf && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onSelectDelete(user.id)}
            className='size-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            title='Delete user'
          >
            <Trash2 className='size-4' />
            <span className='sr-only'>Delete user</span>
          </Button>
        )}
      </div>
    </div>
  );
}
