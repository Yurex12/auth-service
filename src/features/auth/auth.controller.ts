import type { Response, Request } from 'express';

import type { TypedRequest } from '../../types/express.js';

import type {
  ChangePasswordInput,
  LoginInput,
  RequestPasswordResetInput,
  ResendVerificationInput,
  ResetPasswordInput,
  SignupInput,
  VerifyEmailInput,
} from './auth.schema.js';

import {
  changePassword as changePasswordService,
  createUser,
  loginUser,
  logoutUser,
  resendVerificationCode,
  verifyUserEmail,
  requestPasswordReset as requestPasswordResetService,
  verifyPasswordResetCode as verifyPasswordResetCodeService,
  resetPassword as resetPasswordService,
} from './auth.service.js';

import { fifteenMinutes, thirtyDays } from '../../utils/constant.js';

import { AppError } from '../../utils/app-error.js';

export const signup = async (req: TypedRequest<SignupInput>, res: Response) => {
  const user = await createUser({ ...req.body });

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
