import express from 'express';
import {
  loginLimiter,
  signupLimiter,
  verificationLimiter,
} from '../../middleware/rate-limit.js';
import { validateRequestBody } from '../../middleware/validation.js';
import {
  getCurrentUser,
  login,
  logout,
  resendVerification,
  signup,
  verifyEmail,
} from './auth.controller.js';
import {
  loginSchema,
  resendVerificationSchema,
  signupSchema,
  verifyEmailSchema,
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
router.post('/logout', requireAuth, logout);

export default router;
