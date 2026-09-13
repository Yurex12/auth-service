import express from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  loginLimiter,
  passwordResetLimiter,
  signupLimiter,
  verificationLimiter,
} from '../../middleware/rate-limit.js';
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from '../../middleware/validation.js';
import {
  changePassword,
  getCurrentUser,
  getSessions,
  googleCallback,
  googleLinkCallback,
  googleLogin,
  linkGoogleAccount,
  login,
  logout,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  revokeAllSessions,
  revokeOtherSessions,
  signup,
  startGoogleLink,
  verifyEmail,
  verifyPasswordResetCode,
} from './auth.controller.js';
import {
  changePasswordSchema,
  googleCallbackSchema,
  idParamsSchema,
  loginSchema,
  requestPasswordResetSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
  verifyPasswordResetCodeSchema,
} from './auth.schema.js';

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
router.get('/google', googleLogin);
router.get(
  '/google/callback',
  validateRequestQuery(googleCallbackSchema),
  googleCallback,
);
router.post('/google/link', requireAuth, linkGoogleAccount);

// link account after having logged In
router.get('/google/link', requireAuth, startGoogleLink);
router.get(
  '/google/link/callback',
  requireAuth,
  validateRequestQuery(googleCallbackSchema),
  googleLinkCallback,
);

router.get('/sessions', requireAuth, getSessions);

router.delete('/sessions/others', requireAuth, revokeOtherSessions);

router.delete('/sessions/all', requireAuth, revokeAllSessions);

router.delete(
  '/sessions/:id',
  requireAuth,
  validateRequestParams(idParamsSchema),
  revokeAllSessions,
);

export default router;
