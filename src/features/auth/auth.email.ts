import { resend } from '../../lib/resend.js';
import { AppError } from '../../utils/app-error.js';
import { googleAccountLinkedEmailTemplate } from './templates/google-account-linked-email.js';
import { passwordChangedEmailTemplate } from './templates/password-changed-email.js';
import { passwordResetEmailTemplate } from './templates/password-reset-email.js';
import { verificationEmailTemplate } from './templates/verification-email.js';
import { welcomeEmailTemplate } from './templates/welcome-email.js';

export async function sendVerificationEmail({
  email,
  name,
  code,
}: {
  email: string;
  code: string;
  name: string;
}) {
  const { error, data } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [email],
    subject: 'Verify your email',
    html: verificationEmailTemplate(name, code),
  });

  if (error) throw new AppError('Failed to send verification email', 500);

  return { data };
}

export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;

  name: string;
}) {
  const { error, data } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [email],
    subject: 'Your account is verified',
    html: welcomeEmailTemplate(name),
  });

  if (error) throw new AppError('Failed to send welcome email', 500);

  return { data };
}

export async function sendPasswordResetEmail({
  email,
  name,
  code,
}: {
  email: string;
  code: string;
  name: string;
}) {
  const { error, data } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [email],
    subject: 'Reset your password',
    html: passwordResetEmailTemplate(name, code),
  });

  if (error) throw new AppError('Failed to send password reset email', 500);

  return { data };
}

export async function sendPasswordChangedEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const { error, data } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [email],
    subject: 'Your password has been changed',
    html: passwordChangedEmailTemplate(name),
  });

  if (error) throw new AppError('Failed to send password changed email', 500);

  return { data };
}

export async function sendGoogleAccountLinkedEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const { error, data } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [email],
    subject: 'Your Google account has been linked',
    html: googleAccountLinkedEmailTemplate(name),
  });

  if (error) {
    throw new AppError('Failed to send Google account linked email', 500);
  }

  return { data };
}
