import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectedAccountsCard } from '@/features/auth';

export function SecuritySettingsPage() {
  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-16'>
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Shield className='size-5 text-primary' />
            <span className='text-sm font-semibold uppercase tracking-wider'>
              Account Security
            </span>
          </div>
          <h1 className='mt-1 text-3xl font-bold tracking-tight sm:text-4xl'>
            Security Settings
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Manage your connected authentication providers, active login sessions, and credentials.
          </p>
        </div>

        <Button variant='outline' size='sm' asChild className='w-fit gap-2'>
          <Link to='/'>
            <ArrowLeft className='size-4' />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>

      <div className='space-y-6'>
        <ConnectedAccountsCard />
      </div>
    </div>
  );
}
