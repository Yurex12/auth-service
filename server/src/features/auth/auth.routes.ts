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
  getUserAccounts,
  googleCallback,
  googleLinkCallback,
  cancelGoogleLink,
  googleLogin,
  linkGoogleAccount,
  login,
  logout,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  revokeAllSessions,
  revokeOtherSessions,
  revokeSession,
  signup,
  startGoogleLink,
  unlinkGoogleAccount,
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

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account, hashes credentials with Argon2, and sends an email verification code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecureP@ss123"
 *     responses:
 *       201:
 *         description: Sign up successful. Verification email sent.
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: Conflict - email already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  '/signup',
  signupLimiter,
  validateRequestBody(signupSchema),
  signup,
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     description: Verifies user email with the 6-digit OTP code sent to their inbox
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email has been verified
 *       400:
 *         description: Invalid or expired code
 *       500:
 *         description: Internal server error
 */
router.post(
  '/verify-email',
  verificationLimiter,
  validateRequestBody(verifyEmailSchema),
  verifyEmail,
);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification code
 *     description: Generates and sends a new verification OTP code to the user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Verification code sent
 *       400:
 *         description: User already verified or not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/resend-verification',
  verificationLimiter,
  validateRequestBody(resendVerificationSchema),
  resendVerification,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates user credentials and sets an HttpOnly session cookie
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecureP@ss123"
 *     responses:
 *       200:
 *         description: Login successful. Sets session cookie.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: session=sometokenvalue; Path=/; HttpOnly; SameSite=Lax
 *       400:
 *         description: Incorrect email or password, or email not verified
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginLimiter, validateRequestBody(loginSchema), login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns profile details for the currently logged-in user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       401:
 *         description: Unauthorized - missing or invalid session cookie
 */
router.get('/me', requireAuth, getCurrentUser);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     description: Changes password for the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecureP@ss123!"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request - incorrect current password or weak new password
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/change-password',
  requireAuth,
  validateRequestBody(changePasswordSchema),
  changePassword,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out user
 *     description: Revokes the current session from the database and clears the session cookie
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', requireAuth, logout);

/**
 * @swagger
 * /auth/password-reset:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset code to the user email if the account exists
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent if account exists
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  '/password-reset',
  passwordResetLimiter,
  validateRequestBody(requestPasswordResetSchema),
  requestPasswordReset,
);

/**
 * @swagger
 * /auth/password-reset/verify:
 *   post:
 *     summary: Verify password reset code
 *     description: Verifies the OTP code sent for password reset and returns a reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid or expired code
 *       500:
 *         description: Internal server error
 */
router.post(
  '/password-reset/verify',
  passwordResetLimiter,
  validateRequestBody(verifyPasswordResetCodeSchema),
  verifyPasswordResetCode,
);

/**
 * @swagger
 * /auth/password-reset/confirm:
 *   post:
 *     summary: Confirm password reset
 *     description: Sets the new password using the reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid reset token or weak password
 *       500:
 *         description: Internal server error
 */
router.post(
  '/password-reset/confirm',
  passwordResetLimiter,
  validateRequestBody(resetPasswordSchema),
  resetPassword,
);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects user to Google OAuth 2.0 authorization screen
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirects to Google consent screen
 */
router.get('/google', googleLogin);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles OAuth redirect callback from Google, sets session cookie, and redirects to client
 *     tags: [OAuth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: CSRF state token
 *     responses:
 *       302:
 *         description: Redirects to client URL with session set
 *       400:
 *         description: Invalid OAuth code or state
 */
router.get(
  '/google/callback',
  validateRequestQuery(googleCallbackSchema),
  googleCallback,
);

/**
 * @swagger
 * /auth/google/link:
 *   post:
 *     summary: Link Google account with ID token
 *     description: Links an existing user account with Google credentials
 *     tags: [OAuth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Google account linked successfully
 *       400:
 *         description: Google account already linked
 *       401:
 *         description: Unauthorized
 */
router.post('/google/link', linkGoogleAccount);

/**
 * @swagger
 * /auth/google/link/cancel:
 *   post:
 *     summary: Cancel Google account linking
 *     description: Clears the pending Google link token cookie when the user cancels linking
 *     tags: [OAuth]
 *     responses:
 *       200:
 *         description: Google account linking cancelled successfully
 */
router.post('/google/link/cancel', cancelGoogleLink);

/**
 * @swagger
 * /auth/google/unlink:
 *   delete:
 *     summary: Unlink Google account
 *     description: Unlinks and removes the connected Google authentication provider
 *     tags: [OAuth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Google account unlinked successfully
 *       400:
 *         description: Cannot unlink Google without password set up or not linked
 *       401:
 *         description: Unauthorized
 */
router.delete('/google/unlink', requireAuth, unlinkGoogleAccount);

/**
 * @swagger
 * /auth/google/link:
 *   get:
 *     summary: Start Google account linking flow
 *     description: Initiates OAuth flow to link Google account to current logged in user
 *     tags: [OAuth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth screen with link state
 *       401:
 *         description: Unauthorized
 */
router.get('/google/link', requireAuth, startGoogleLink);

/**
 * @swagger
 * /auth/google/link/callback:
 *   get:
 *     summary: Google account linking callback
 *     description: Handles callback from Google to complete account linking
 *     tags: [OAuth]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to client URL with link status
 *       400:
 *         description: Invalid state or code
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/google/link/callback',
  requireAuth,
  validateRequestQuery(googleCallbackSchema),
  googleLinkCallback,
);

/**
 * @swagger
 * /auth/accounts:
 *   get:
 *     summary: Get linked user accounts
 *     description: Retrieves all connected authentication providers for the current user
 *     tags: [OAuth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/accounts', requireAuth, getUserAccounts);

/**
 * @swagger
 * /auth/sessions:
 *   get:
 *     summary: Get all active sessions
 *     description: Retrieves all active login sessions for the authenticated user
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/sessions', requireAuth, getSessions);

/**
 * @swagger
 * /auth/sessions:
 *   delete:
 *     summary: Revoke all sessions
 *     description: Revokes all sessions for the user including the current one, clearing login across all devices
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All sessions revoked successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/sessions', requireAuth, revokeAllSessions);

/**
 * @swagger
 * /auth/sessions/others:
 *   delete:
 *     summary: Revoke other sessions
 *     description: Revokes all other sessions except the currently active one
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Other sessions revoked successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/sessions/others', requireAuth, revokeOtherSessions);

/**
 * @swagger
 * /auth/sessions/{id}:
 *   delete:
 *     summary: Revoke a specific session
 *     description: Revokes a single session by its ID
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Session UUID to revoke
 *     responses:
 *       200:
 *         description: Session revoked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.delete(
  '/sessions/:id',
  requireAuth,
  validateRequestParams(idParamsSchema),
  revokeSession,
);

export default router;
