import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <span className="text-6xl font-black text-primary">404</span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
