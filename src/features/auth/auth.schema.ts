import * as z from 'zod';
import type { codec } from 'zod/mini';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Invalid email address'));

export const passwordSchema = z
  .string()
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,32}$/, {
    message:
      'Password must be 8–32 characters and include uppercase, lowercase, a number, and a special character.',
  });
export const codeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Code must be exactly 6 digits');

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: emailSchema,
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: codeSchema,
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});
export const resetPasswordSchema = z.object({
  password: passwordSchema,
});
export const verifyPasswordResetCodeSchema = z.object({
  email: emailSchema,
  code: codeSchema,
});

export const googleCallbackSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  state: z.string().min(1, 'State is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
export type VerifyPasswordResetCodeInput = z.infer<
  typeof verifyPasswordResetCodeSchema
>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type googleCallbackQuery = z.infer<typeof googleCallbackSchema>;
