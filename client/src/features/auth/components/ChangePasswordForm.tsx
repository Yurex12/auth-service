import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
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
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../schemas/authSchema';
import { useChangePassword } from '../hooks/useChangePassword';
import { useUserAccounts } from '../hooks/useUserAccounts';

export function ChangePasswordForm() {
  const navigate = useNavigate();

  const { data: accountsData, isPending: isLoadingAccounts } =
    useUserAccounts();
  const hasCredential = accountsData?.accounts?.some(
    (acc) => acc.providerId === 'credential',
  );

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: ChangePasswordFormValues) {
    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          navigate('/settings/security');
        },
      },
    );
  }

  if (!isLoadingAccounts && accountsData && !hasCredential) {
    return <Navigate to='/settings/security' replace />;
  }

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <KeyRound className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure. Other active
          sessions will be signed out.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='gap-5'>
            {/* Current Password */}
            <Controller
              control={form.control}
              name='currentPassword'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex items-center justify-between'>
                    <FieldLabel htmlFor='currentPassword'>
                      Current Password
                    </FieldLabel>
                    <Link
                      to='/forgot-password'
                      className='text-xs font-medium text-primary hover:underline'
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className='relative'>
                    <Input
                      {...field}
                      id='currentPassword'
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='current-password'
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
                      aria-label={
                        showCurrentPassword
                          ? 'Hide current password'
                          : 'Show current password'
                      }
                    >
                      {showCurrentPassword ? (
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

            {/* New Password */}
            <Controller
              control={form.control}
              name='newPassword'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
                  <div className='relative'>
                    <Input
                      {...field}
                      id='newPassword'
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='new-password'
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
                      aria-label={
                        showNewPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showNewPassword ? (
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
                    Confirm New Password
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
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Change Password</span>
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
