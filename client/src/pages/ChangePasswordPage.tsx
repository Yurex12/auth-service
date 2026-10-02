import { ChangePasswordForm } from '@/features/auth';

export function ChangePasswordPage() {
  return (
    <div className='flex min-h-[calc(100vh-8rem)] items-center justify-center p-4 sm:p-6'>
      <ChangePasswordForm />
    </div>
  );
}
