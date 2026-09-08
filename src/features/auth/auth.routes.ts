import express from 'express';
import {
  loginLimiter,
  passwordResetLimiter,
  signupLimiter,
  verificationLimiter,
} from '../../middleware/rate-limit.js';
import { validateRequestBody } from '../../middleware/validation.js';
import {
  changePassword,
  getCurrentUser,
  login,
  logout,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  signup,
  verifyEmail,
  verifyPasswordResetCode,
} from './auth.controller.js';
import {
  changePasswordSchema,
  loginSchema,
  requestPasswordResetSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
  verifyPasswordResetCodeSchema,
} from './auth.schema.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/signup',
  signupLimiter,
  validateRequestBody(signupSchema),
  signup,
);
router.post(
  '/verify-email',
  verificationLimiter,
  validateRequestBody(verifyEmailSchema),
  verifyEmail,
);
router.post(
  '/resend-verification',
  verificationLimiter,
  validateRequestBody(resendVerificationSchema),
  resendVerification,
);
router.post('/login', loginLimiter, validateRequestBody(loginSchema), login);
router.get('/me', requireAuth, getCurrentUser);
router.post(
  '/change-password',
  requireAuth,
  validateRequestBody(changePasswordSchema),
  changePassword,
);
router.post('/logout', requireAuth, logout);
router.post(
  '/password-reset',
  passwordResetLimiter,
  validateRequestBody(requestPasswordResetSchema),
  requestPasswordReset,
);
router.post(
  '/password-reset/verify',
  passwordResetLimiter,
  validateRequestBody(verifyPasswordResetCodeSchema),
  verifyPasswordResetCode,
);
router.post(
  '/password-reset/confirm',
  passwordResetLimiter,
  validateRequestBody(resetPasswordSchema),
  resetPassword,
);

export default router;
