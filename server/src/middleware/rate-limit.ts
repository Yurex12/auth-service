import rateLimit from 'express-rate-limit';

const createLimiter = ({
  windowMs,
  limit,
  message,
}: {
  windowMs: number;
  limit: number;
  message: string;
}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
    skip: () => process.env.NODE_ENV === 'test',
  });

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: 'Too many requests, please try again later.',
});

export const signupLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many sign up attempts, please try again later.',
});

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many login attempts, please try again later.',
});

export const verifyEmailLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many verification attempts, please try again later.',
});

export const resendVerificationLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many verification code requests, please try again later.',
});

export const requestPasswordResetLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many password reset requests, please try again later.',
});

export const verifyPasswordResetLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message:
    'Too many password reset verification attempts, please try again later.',
});

export const resetPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many password reset attempts, please try again later.',
});

export const requestSetPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many password setup requests, please try again later.',
});

export const verifySetPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message:
    'Too many password setup verification attempts, please try again later.',
});

export const setPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many password setup attempts, please try again later.',
});
