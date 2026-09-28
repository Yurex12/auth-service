import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        Authentication Service
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        A secure authentication platform built with Express, Drizzle ORM, and React.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link to="/login">Log In</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </main>
  );
}
