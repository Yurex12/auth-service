import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
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
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../schemas/authSchema';
import { useResetPassword } from '../hooks/useResetPassword';

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { email?: string } | null;
  const email = state?.email ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: ResetPasswordFormValues) {
    resetPassword(
      { password: data.password },
      {
        onSuccess: () => {
          navigate('/login');
        },
      },
    );
  }

  if (!email) {
    return (
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-2 text-center'>
          <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <Lock className='size-6' />
          </div>
          <CardTitle className='text-xl font-bold tracking-tight'>
            Reset Session Required
          </CardTitle>
          <CardDescription>
            You need to verify a reset code before setting a new password.
          </CardDescription>
        </CardHeader>
        <CardFooter className='justify-center'>
          <Link to='/forgot-password'>
            <Button variant='default'>Request Reset Code</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Lock className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Set new password
        </CardTitle>
        <CardDescription>
          Must be at least 8 characters with uppercase, lowercase, number, and
          special character.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='gap-5'>
            {/* Password */}
            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='password'>New Password</FieldLabel>
                  <div className='relative'>
                    <Input
                      {...field}
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='new-password'
                      className='pr-10'
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-xs'
                      className='absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className='size-4' />
                      ) : (
                        <Eye className='size-4' />
                      )}
                      <span className='sr-only'>Toggle password visibility</span>
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name='confirmPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='confirmPassword'>
                    Confirm Password
                  </FieldLabel>
                  <div className='relative'>
                    <Input
                      {...field}
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='new-password'
                      className='pr-10'
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-xs'
                      className='absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='size-4' />
                      ) : (
                        <Eye className='size-4' />
                      )}
                      <span className='sr-only'>
                        Toggle confirm password visibility
                      </span>
                    </Button>
                  </div>
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
                  Resetting password...
                </>
              ) : (
                'Reset Password'
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
