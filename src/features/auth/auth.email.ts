import { resend } from '../../lib/resend.js';
import { AppError } from '../../utils/app-error.js';
import { verificationEmailTemplate } from './templates/verification-email.js';
import { welcomeEmailTemplate } from './templates/welcome-email.js';

export async function sendVerificationEmail({
  email,
  name,
  token,
}: {
  email: string;
  token: string;
  name: string;
}) {
  const { error, data } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: [email],
    subject: 'Verify your email',
    html: verificationEmailTemplate(name, token),
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
