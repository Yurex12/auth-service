import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  setPasswordFormSchema,
  type SetPasswordFormValues,
} from '../schemas/authSchema';
import { useSetPassword } from '../hooks/useSetPassword';

export function SetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { verified?: boolean } | null;
  const isVerified = state?.verified;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: setPassword, isPending } = useSetPassword();

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: SetPasswordFormValues) {
    setPassword(
      {
        password: data.password,
      },
      {
        onSuccess: () => {
          navigate('/settings/security');
        },
      },
    );
  }

  if (!isVerified) return <Navigate to='/settings/security' replace />;

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Lock className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Create Account Password
        </CardTitle>
        <CardDescription>
          Choose a strong password to enable email & password sign-in for your
          account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='gap-5'>
            {/* Password */}
            <Controller
              control={form.control}
              name='password'
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
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((prev) => !prev)}
                      className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='size-4' />
                      ) : (
                        <Eye className='size-4' />
                      )}
                    </button>
                  </div>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={form.control}
              name='confirmPassword'
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
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='size-4' />
                      ) : (
                        <Eye className='size-4' />
                      )}
                    </button>
                  </div>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  Setting Password...
                </>
              ) : (
                'Set Password'
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className='justify-center border-t py-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link
            to='/settings/security'
            className='inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground'
          >
            <ArrowLeft className='size-4' />
            Cancel and Return
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
