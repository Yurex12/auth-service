import type { Request, Response } from 'express';

import type { TypedRequest } from '../../types/express.js';

import type {
  ChangePasswordInput,
  GoogleCallbackQuery,
  IdParam,
  LoginInput,
  RequestPasswordResetInput,
  ResendVerificationInput,
  ResetPasswordInput,
  SignupInput,
  VerifyEmailInput,
} from './auth.schema.js';

import {
  authenticateWithGoogle,
  changePassword as changePasswordService,
  createUser,
  getActiveSessions,
  linkGoogleAccount as linkGoogleAccountService,
  loginUser,
  logoutUser,
  requestPasswordReset as requestPasswordResetService,
  resendVerificationCode,
  resetPassword as resetPasswordService,
  revokeSession as revokeSessionService,
  verifyPasswordResetCode as verifyPasswordResetCodeService,
  verifyUserEmail,
} from './auth.service.js';

import {
  fifteenMinutes,
  tenMinutes,
  thirtyDays,
} from '../../utils/constant.js';

import { AppError } from '../../utils/app-error.js';
import { generateToken } from '../../utils/token.js';
import {
  createOAuthLinkToken,
  exchangeGoogleCode,
  verifyGoogleIdToken,
  verifyOAuthLinkToken,
} from './auth.oauth.js';

export const signup = async (req: TypedRequest<SignupInput>, res: Response) => {
  const { user } = await createUser({ ...req.body });

  res.status(201).json({
    success: true,
    message: 'Sign up successful. Check your email for the verification code.',
    user,
  });
};

export const verifyEmail = async (
  req: TypedRequest<VerifyEmailInput>,
  res: Response,
) => {
  await verifyUserEmail({ ...req.body });

  res.json({
    success: true,
    message: 'Email has been verified',
  });
};

export const resendVerification = async (
  req: TypedRequest<ResendVerificationInput>,
  res: Response,
) => {
  await resendVerificationCode({ ...req.body });

  res.json({
    success: true,
    message: 'Verification code has been sent to your mail',
  });
};
export const login = async (req: TypedRequest<LoginInput>, res: Response) => {
  const userAgent = req.get('user-agent');
  const ipAddress = req.ip;
  const { user, sessionToken } = await loginUser(req.body, {
    ipAddress,
    userAgent,
  });

  res.cookie('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: thirtyDays,
  });

  res.json({
    success: true,
    message: 'Login successful',
    user,
  });
};
export const getCurrentUser = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'User fetched successfully',
    user: req.user,
  });
};

export const changePassword = async (
  req: TypedRequest<ChangePasswordInput>,
  res: Response,
) => {
  await changePasswordService({
    userId: req.user.id,
    sessionId: req.sessionId,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
};

export const logout = async (req: Request, res: Response) => {
  const session = req.cookies.session;

  try {
    if (session) await logoutUser(session);
  } catch (error) {
    console.error('Failed to delete session', error);
  }

  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.json({
    success: true,
    message: 'Logout successful',
  });
};

export const requestPasswordReset = async (
  req: TypedRequest<RequestPasswordResetInput>,
  res: Response,
) => {
  await requestPasswordResetService(req.body.email);

  res.json({
    success: true,
    message: 'If the email is registered, a reset code has been sent.',
  });
};
export const verifyPasswordResetCode = async (req: Request, res: Response) => {
  const { resetToken } = await verifyPasswordResetCodeService(req.body);

  res.cookie('resetToken', resetToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: fifteenMinutes,
  });

  res.json({
    success: true,
    message: 'Code verified',
  });
};

export const resetPassword = async (
  req: TypedRequest<ResetPasswordInput>,
  res: Response,
) => {
  const resetToken = req.cookies.resetToken;

  if (!resetToken)
    throw new AppError('Invalid or expired password reset session', 400);

  await resetPasswordService({ resetToken, password: req.body.password });

  res.clearCookie('resetToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.json({
    success: true,
    message: 'Password reset successful',
  });
};

export const googleLogin = async (req: Request, res: Response) => {
  const state = generateToken();

  res.cookie('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tenMinutes,
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  res.redirect(googleAuthUrl);
};

export const googleCallback = async (
  req: TypedRequest<unknown, unknown, GoogleCallbackQuery>,
  res: Response,
) => {
  const cookieState = req.cookies.google_oauth_state;

  const userAgent = req.get('user-agent');
  const ipAddress = req.ip;

  const urlState = req.query.state;
  const code = req.query.code;

  if (cookieState !== urlState) throw new AppError('Invalid OAuth state', 400);

  if (!code) throw new AppError('OAuth code is required', 400);

  res.clearCookie('google_oauth_state');

  const { id_token } = await exchangeGoogleCode(
    code,
    process.env.GOOGLE_REDIRECT_URI!,
  );

  const ticket = await verifyGoogleIdToken(id_token);

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload?.email || !payload?.email_verified)
    throw new AppError('Invalid Google account information', 400);

  const { sessionToken, userId } = await authenticateWithGoogle(
    {
      accountId: payload.sub,
      email: payload.email,
      name: payload.name,
    },
    { ipAddress, userAgent },
  );

  if (!sessionToken && userId) {
    const token = createOAuthLinkToken({
      accountId: payload.sub,
      expiresAt: Date.now() + tenMinutes,
      userId,
    });

    res.cookie('google_link_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tenMinutes,
    });

    res.redirect(
      `${process.env.CLIENT_URL}/login?google=account-link-required`,
    );
  } else if (sessionToken) {
    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: thirtyDays,
    });

    res.redirect(`${process.env.CLIENT_URL}/login?google=success`);
  } else {
    throw new AppError('Google authentication failed', 400);
  }
};

export const linkGoogleAccount = async (req: Request, res: Response) => {
  const googleLinkToken = req.cookies.google_link_token;

  if (!googleLinkToken)
    throw new AppError('Google link token is required', 400);

  const { accountId, userId } = verifyOAuthLinkToken(googleLinkToken);

  if (req.userId !== userId) throw new AppError('Invalid operation', 400);

  await linkGoogleAccountService({
    accountId,
    userId: req.userId,
    email: req.user.email,
    name: req.user.name,
  });

  res.clearCookie('google_link_token');

  res.json({
    success: true,
    message: 'Google Account linked successfully',
  });
};

// Account linking after logging in
export const startGoogleLink = async (req: Request, res: Response) => {
  const state = generateToken();

  res.cookie('google_link_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tenMinutes,
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_LINK_REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  res.redirect(googleAuthUrl);
};

export const googleLinkCallback = async (
  req: TypedRequest<unknown, unknown, GoogleCallbackQuery>,
  res: Response,
) => {
  const cookieState = req.cookies.google_link_oauth_state;

  const urlState = req.query.state;
  const code = req.query.code;

  if (cookieState !== urlState) throw new AppError('Invalid OAuth state', 400);

  if (!code) throw new AppError('OAuth code is required', 400);

  res.clearCookie('google_link_oauth_state');

  const { id_token } = await exchangeGoogleCode(
    code,
    process.env.GOOGLE_LINK_REDIRECT_URI!,
  );

  const ticket = await verifyGoogleIdToken(id_token);

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload?.email || !payload?.email_verified)
    throw new AppError('Invalid Google account information', 400);

  if (payload.email !== req.user.email) {
    throw new AppError(
      'Google account email does not match signed-in user',
      400,
    );
  }

  await linkGoogleAccountService({
    accountId: payload.sub,
    userId: req.userId,
    email: payload.email,
    name: payload.name || 'user',
  });

  res.redirect(`${process.env.CLIENT_URL}/settings?google=linked`);
};

export const getSessions = async (req: Request, res: Response) => {
  const sessionId = req.sessionId;
  const { sessions } = await getActiveSessions(req.userId);

  const activeSessions = sessions.map((session) => ({
    ...session,
    token: null,
    currentSession: session.token === sessionId,
  }));

  res.json({
    success: true,
    message: 'Successful',
    sessions: activeSessions,
  });
};

export const revokeSession = async (
  req: TypedRequest<unknown, IdParam>,
  res: Response,
) => {
  await revokeSessionService(req.userId, req.params.id);

  res.json({
    success: true,
    message: 'Successful',
  });
};
