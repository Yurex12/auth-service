import { LoginForm, useGoogleOAuthCallback } from '@/features/auth';

export function LoginPage() {
  useGoogleOAuthCallback();

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <LoginForm />
    </main>
  );
}
