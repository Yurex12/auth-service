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
  });

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later.',
});

export const signupLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many sign up attempts, please try again later.',
});

export const verificationLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many verification attempts, please try again later.',
});

export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many login attempts, please try again later.',
});

export const passwordResetLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: 'Too many password reset attempts, please try again later.',
});
