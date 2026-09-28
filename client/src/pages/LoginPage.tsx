import { Link } from 'react-router-dom';

export function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Log In</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your credentials to access your account.
        </p>

        <div className="my-8 rounded-lg border border-dashed p-6 text-muted-foreground">
          Login form will go here
        </div>

        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-primary underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
