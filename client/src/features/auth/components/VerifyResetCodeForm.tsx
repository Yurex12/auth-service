import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
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
  verifyResetCodeSchema,
  type VerifyResetCodeFormValues,
} from '../schemas/authSchema';
import { useVerifyResetCode } from '../hooks/useVerifyResetCode';
import { useRequestPasswordReset } from '../hooks/useRequestPasswordReset';

export function VerifyResetCodeForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { email?: string } | null;
  const email = state?.email ?? '';

  const [countdown, setCountdown] = useState(0);

  const { mutate: verifyResetCode, isPending: isVerifying } =
    useVerifyResetCode();
  const { mutate: resendCode, isPending: isResending } =
    useRequestPasswordReset();

  const form = useForm<VerifyResetCodeFormValues>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  function onSubmit(data: VerifyResetCodeFormValues) {
    if (!email) return;
    verifyResetCode(
      { email, code: data.code },
      {
        onSuccess: () => {
          navigate('/reset-password', {
            state: { email },
          });
        },
      },
    );
  }

  const handleResend = () => {
    if (!email || countdown > 0 || isResending) return;
    resendCode(
      { email },
      {
        onSuccess: () => setCountdown(60),
      },
    );
  };

  if (!email) {
    return (
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-2 text-center'>
          <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <KeyRound className='size-6' />
          </div>
          <CardTitle className='text-xl font-bold tracking-tight'>
            No Email Provided
          </CardTitle>
          <CardDescription>
            We couldn&apos;t find an email to verify. Please enter your email to
            request a password reset code.
          </CardDescription>
        </CardHeader>
        <CardFooter className='justify-center'>
          <Link to='/forgot-password'>
            <Button variant='default'>Go to Forgot Password</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <KeyRound className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Enter verification code
        </CardTitle>
        <CardDescription>
          We sent a 6-digit reset code to
          <span className='mt-1 block font-semibold text-foreground'>
            {email}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className='gap-5'>
            <Controller
              control={form.control}
              name='code'
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className='items-center'
                >
                  <FieldLabel htmlFor='code' className='sr-only'>
                    Reset Verification Code
                  </FieldLabel>
                  <div className='flex justify-center py-2'>
                    <InputOTP
                      {...field}
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      disabled={isVerifying}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className='text-center'
                    />
                  )}
                </Field>
              )}
            />

            <Button type='submit' className='w-full' disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className='mt-5 flex items-center justify-center text-sm text-muted-foreground'>
          <span>Didn&apos;t receive a code?</span>{' '}
          <Button
            type='button'
            variant='link'
            size='sm'
            className='h-auto p-0 pl-1.5 font-medium text-primary'
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
          >
            {isResending ? (
              <span className='flex items-center gap-1'>
                <RefreshCw className='size-3 animate-spin' /> Sending...
              </span>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              'Resend code'
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter className='justify-center border-t py-4'>
        <Link
          to='/forgot-password'
          className='inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='mr-1.5 size-4' />
          Back to forgot password
        </Link>
      </CardFooter>
    </Card>
  );
}
