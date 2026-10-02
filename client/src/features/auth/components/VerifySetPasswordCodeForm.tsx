import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  verifySetPasswordCodeSchema,
  type VerifySetPasswordCodeFormValues,
} from '../schemas/authSchema';
import { useRequestSetPassword } from '../hooks/useRequestSetPassword';
import { useVerifySetPasswordCode } from '../hooks/useVerifySetPasswordCode';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function VerifySetPasswordCodeForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { requested?: boolean } | null;
  const isRequested = state?.requested;

  const { data: userData } = useCurrentUser();
  const email = userData?.user?.email ?? '';

  const [countdown, setCountdown] = useState(60);

  const { mutate: resendCode, isPending: isResending } =
    useRequestSetPassword();
  const { mutate: verifyCode, isPending: isVerifying } =
    useVerifySetPasswordCode();

  const form = useForm<VerifySetPasswordCodeFormValues>({
    resolver: zodResolver(verifySetPasswordCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isRequested) return <Navigate to='/settings/security' replace />;

  function onSubmit(data: VerifySetPasswordCodeFormValues) {
    verifyCode(
      { code: data.code },
      {
        onSuccess: () => {
          navigate('/set-password', {
            state: { verified: true },
          });
        },
      },
    );
  }

  const handleResend = () => {
    if (countdown > 0 || isResending) return;
    resendCode(undefined, {
      onSuccess: () => setCountdown(60),
    });
  };

  return (
    <Card className='w-full max-w-md shadow-lg'>
      <CardHeader className='space-y-2 text-center'>
        <div className='mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <KeyRound className='size-6' />
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Verify Your Email
        </CardTitle>
        <CardDescription>
          Enter the 6-digit verification code sent to
          {email && (
            <span className='mt-1 block font-semibold text-foreground'>
              {email}
            </span>
          )}
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
                    Verification Code
                  </FieldLabel>
                  <div className='flex w-full justify-center py-2'>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      containerClassName='justify-center'
                      disabled={form.formState.isSubmitting || isVerifying}
                      aria-describedby={
                        fieldState.error ? 'code-error' : undefined
                      }
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
                  {fieldState.error && (
                    <FieldError id='code-error' className='text-center'>
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={form.formState.isSubmitting || isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Continue to Set Password</span>
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className='mt-6 text-center text-sm'>
          <p className='text-muted-foreground'>
            Didn&apos;t receive the code?{' '}
            {countdown > 0 ? (
              <span className='text-muted-foreground font-medium'>
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type='button'
                onClick={handleResend}
                disabled={isResending}
                className='inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-50'
              >
                {isResending ? (
                  <>
                    <Loader2 className='size-3 animate-spin' />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className='size-3' />
                    Resend Code
                  </>
                )}
              </button>
            )}
          </p>
        </div>
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
