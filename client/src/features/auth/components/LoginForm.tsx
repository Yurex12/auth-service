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
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';
import { useLogin } from '../hooks/useLogin';
import { GoogleButton } from './GoogleButton';

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'yusufekungomi@gmail.com',
      password: 'Adeyemi@10',
    },
  });

  function onSubmit(data: LoginFormValues) {
    login(data, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error) => {
        if (error.message?.toLowerCase().includes('email not verified')) {
          navigate('/verify-email', { state: { email: data.email } });
        }
      },
    });
  }


  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your email and password to log in to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pr-10"
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      <span className="sr-only">Toggle password visibility</span>
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </Button>
        </form>

        <FieldSeparator className="my-2">Or continue with</FieldSeparator>

        <GoogleButton disabled={isPending} />
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
