import type { Response, Request } from 'express';

import type { TypedRequest } from '../../types/express.js';

import type {
  loginInput,
  resendVerificationInput,
  signupInput,
  verifyEmailInput,
} from './auth.schema.js';
import {
  createUser,
  loginUser,
  logoutUser,
  resendVerificationCode,
  verifyUserEmail,
} from './auth.service.js';
import { thirtyDays } from '../../utils/constant.js';

export const signup = async (req: TypedRequest<signupInput>, res: Response) => {
  const user = await createUser({ ...req.body });

  res.status(201).json({
    success: true,
    message: 'Sign up successful. Check your email for the verification code.',
    user,
  });
};

export const verifyEmail = async (
  req: TypedRequest<verifyEmailInput>,
  res: Response,
) => {
  await verifyUserEmail({ ...req.body });

  res.json({
    success: true,
    message: 'Email has been verified',
  });
};

export const resendVerification = async (
  req: TypedRequest<resendVerificationInput>,
  res: Response,
) => {
  await resendVerificationCode({ ...req.body });

  res.json({
    success: true,
    message: 'Verification code has been sent to your mail',
  });
};
export const login = async (req: TypedRequest<loginInput>, res: Response) => {
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
