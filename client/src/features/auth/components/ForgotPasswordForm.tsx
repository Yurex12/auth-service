import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  requestPasswordResetSchema,
  type RequestPasswordResetFormValues,
} from '../schemas/authSchema';
import { useRequestPasswordReset } from '../hooks/useRequestPasswordReset';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { mutate: requestReset, isPending } = useRequestPasswordReset();

  const form = useForm<RequestPasswordResetFormValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: RequestPasswordResetFormValues) {
    requestReset(data, {
      onSuccess: () => {
        navigate('/forgot-password/verify', {
          state: { email: data.email },
        });
      },
    });
  }

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <KeyRound className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Forgot password?
        </CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a 6-digit code to
          reset your password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='gap-5'>
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email'>Email address</FieldLabel>
                  <Input
                    {...field}
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    autoComplete='email'
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  Sending code...
                </>
              ) : (
                'Send Reset Code'
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className='justify-center border-t py-4'>
        <Link
          to='/login'
          className='inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='mr-1.5 size-4' />
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
