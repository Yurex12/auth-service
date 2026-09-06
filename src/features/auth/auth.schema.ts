import * as z from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Invalid email address'));

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: emailSchema,
  password: z
    .string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,32}$/, {
      message:
        'Password must be 8–32 characters and include uppercase, lowercase, a number, and a special character.',
    }),
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  token: z.string().regex(/^\d{6}$/, 'Code must be exactly 6 digits'),
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type signupInput = z.infer<typeof signupSchema>;
export type verifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type resendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type loginInput = z.infer<typeof loginSchema>;
