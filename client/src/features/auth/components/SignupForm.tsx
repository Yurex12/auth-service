import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signupSchema, type SignupFormValues } from '../schemas/authSchema';
import { useSignup } from '../hooks/useSignup';
import { GoogleButton } from './GoogleButton';

export function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: signup, isPending } = useSignup();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: 'Ekungomi Yusuf',
      email: 'yusufekungomi@gmail.com',
      password: 'Adeyemi@10',
      confirmPassword: 'Adeyemi@10',
    },
  });

  function onSubmit(data: SignupFormValues) {
    signup(data, {
      onSuccess: () => {
        navigate('/verify-email', { state: { email: data.email } });
      },
    });
  }

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-1 text-center'>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FieldGroup>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                  <Input
                    {...field}
                    id='name'
                    placeholder='John Doe'
                    autoComplete='name'
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='email'
                    type='email'
                    placeholder='name@example.com'
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

            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
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
                      <span className='sr-only'>
                        Toggle password visibility
                      </span>
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

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
          </FieldGroup>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <FieldSeparator className='my-2'>Or continue with</FieldSeparator>

        <GoogleButton disabled={isPending} />
      </CardContent>

      <CardFooter className='justify-center'>
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-primary underline underline-offset-4'
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
