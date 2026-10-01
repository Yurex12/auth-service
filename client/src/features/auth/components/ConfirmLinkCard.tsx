import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Link2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleIcon } from './GoogleIcon';
import { useConfirmGoogleLink } from '../hooks/useConfirmGoogleLink';
import { useCancelGoogleLink } from '../hooks/useCancelGoogleLink';

export function ConfirmLinkCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || 'your account';
  const { mutate: confirmLink, isPending: isLinking } = useConfirmGoogleLink();
  const { mutate: cancelLink, isPending: isCancelling } = useCancelGoogleLink();

  function handleConfirm() {
    confirmLink(undefined, {
      onSuccess: () => {
        navigate('/', { replace: true });
      },
    });
  }

  function handleCancel() {
    cancelLink(undefined, {
      onSettled: () => {
        navigate('/login', { replace: true });
      },
    });
  }

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Link2 className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Link Google Account
        </CardTitle>
        <CardDescription>
          An existing account was found for this email address.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-center gap-3 rounded-lg border bg-muted/40 p-3.5'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-md bg-background shadow-xs'>
            <Mail className='size-4 text-muted-foreground' />
          </div>
          <div className='min-w-0 flex-1'>
            <p className='text-xs text-muted-foreground'>Existing Account</p>
            <p className='truncate text-sm font-semibold text-foreground'>
              {email}
            </p>
          </div>
        </div>

        <div className='flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground'>
          <ShieldCheck className='size-4 shrink-0 text-primary' />
          <span>
            Linking will allow you to sign in with either Google or your email
            credentials going forward.
          </span>
        </div>

        <Button
          type='button'
          className='w-full gap-2'
          onClick={handleConfirm}
          disabled={isLinking || isCancelling}
        >
          {isLinking ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <GoogleIcon className='size-4' />
          )}
          <span>{isLinking ? 'Linking...' : 'Link Google'}</span>
        </Button>
      </CardContent>

      <CardFooter className='justify-center border-t py-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleCancel}
          disabled={isLinking || isCancelling}
          className='inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='size-4' />
          <span>Cancel and Return to Login</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
