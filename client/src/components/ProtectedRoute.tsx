import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCurrentUser } from '@/features/auth';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-primary' />
      </div>
    );

  if (!data?.user)
    return <Navigate to='/login' state={{ from: location }} replace />;

  return <>{children}</>;
}
