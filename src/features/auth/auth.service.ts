import { and, eq, ne } from 'drizzle-orm';
import { db } from '../../db/index.js';
import {
  passwordResetsTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from '../../db/schema.js';
import { AppError } from '../../utils/app-error.js';
import { fifteenMinutes, thirtyDays } from '../../utils/constant.js';
import { generateToken, generateOTP, hashToken } from '../../utils/token.js';
import {
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from './auth.email.js';
import type {
  ChangePasswordInput,
  LoginInput,
  ResendVerificationInput,
  SignupInput,
  VerifyEmailInput,
  VerifyPasswordResetCodeInput,
} from './auth.schema.js';

import argon from 'argon2';
import type { LoginMetadata } from './auth.types.js';

export const createUser = async (userData: SignupInput) => {
  const { name, email, password } = userData;

  const hashedPassword = await argon.hash(password);

  const code = generateOTP();
  const hashedCode = hashToken(code);

  const { user } = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(usersTable)
      .values({ email, name, password: hashedPassword })
      .onConflictDoNothing({ target: usersTable.email })
      .returning();

    if (!user) throw new AppError('Email already exists', 409);

    await tx.insert(verificationsTable).values({
      token: hashedCode,
      userId: user.id,
      expiresAt: new Date(Date.now() + fifteenMinutes),
    });

    return { user };
  });

  await sendVerificationEmail({ email, code, name });

  const { password: _, ...newUser } = user;

  return { ...newUser };
};

export const verifyUserEmail = async (userData: VerifyEmailInput) => {
  const hashedCode = hashToken(userData.code);

  const user = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, userData.email),
    columns: { verifiedAt: true, name: true, id: true },
  });

  if (!user) throw new AppError('Invalid code', 400);

  if (user.verifiedAt) throw new AppError('User already verified', 400);

  const tokenData = await db.query.verificationsTable.findFirst({
    where: (verification, { eq, and }) =>
      and(eq(verification.userId, user.id), eq(verification.token, hashedCode)),
  });

  if (!tokenData) throw new AppError('Invalid code', 400);

  if (new Date() > tokenData.expiresAt)
    throw new AppError('Code has expired, request another', 400);

  await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(verificationsTable)
      .where(
        and(
          eq(verificationsTable.id, tokenData.id),
          eq(verificationsTable.userId, user.id),
        ),
      )
      .returning({ id: verificationsTable.id });

    if (deleted.length === 0)
      throw new AppError('Invalid or already used code', 400);

    await tx
      .update(usersTable)
      .set({ verifiedAt: new Date() })
      .where(eq(usersTable.id, user.id));
  });

  try {
    await sendWelcomeEmail({ email: userData.email, name: user.name });
  } catch (error) {
    console.error('Failed to send welcome email', error);
  }
};

export const resendVerificationCode = async ({
  email,
}: ResendVerificationInput) => {
  const user = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
    columns: { password: false },
  });

  if (!user)
    throw new AppError('Verification code has been sent to your mail', 404);

  if (user.verifiedAt) throw new AppError('User already verified', 400);

  const code = generateOTP();
  const hashedCode = hashToken(code);

  await db.transaction(async (tx) => {
    await tx
      .delete(verificationsTable)
      .where(eq(verificationsTable.userId, user.id));

    await tx.insert(verificationsTable).values({
      token: hashedCode,
      userId: user.id,
      expiresAt: new Date(Date.now() + fifteenMinutes),
    });
  });

  await sendVerificationEmail({ email, code, name: user.name });

  return { user };
};

export const loginUser = async (
  { email, password }: LoginInput,
  { ipAddress, userAgent }: LoginMetadata,
) => {
  const user = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  if (!user) throw new AppError('Incorrect Email or password', 400);

  const passwordMatch = await argon.verify(user.password, password);

  if (!passwordMatch) throw new AppError('Incorrect Email or password', 400);

  if (!user.verifiedAt) throw new AppError('Email not verified', 400);

  const sessionToken = generateToken();
  const hashedSessionToken = hashToken(sessionToken);

  await db.insert(sessionsTable).values({
    token: hashedSessionToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + thirtyDays),
    ipAddress,
    userAgent,
  });

  const { password: _, ...newUser } = user;

  return { user: newUser, sessionToken };
};

export const logoutUser = async (sessionToken: string) => {
  const hashedSessionToken = hashToken(sessionToken);

  await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.token, hashedSessionToken));
};

export const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
  sessionId,
}: ChangePasswordInput & {
  userId: string;
  sessionId: string;
}) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
  });

  if (!user) throw new AppError('User not found', 404);

  const passwordMatch = await argon.verify(user.password, currentPassword);

  if (!passwordMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  const hashedPassword = await argon.hash(newPassword);

  await db.transaction(async (tx) => {
    await tx
      .update(usersTable)
      .set({ password: hashedPassword })
      .where(eq(usersTable.id, userId));

    await tx
      .delete(sessionsTable)
      .where(
        and(
          eq(sessionsTable.userId, userId),
          ne(sessionsTable.id, sessionId),
        ),
      );
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user) return;

  const code = generateOTP();
  const hashedCode = hashToken(code);

  await db.transaction(async (tx) => {
    await tx
      .delete(passwordResetsTable)
      .where(eq(passwordResetsTable.userId, user.id));

    await tx.insert(passwordResetsTable).values({
      tokenHash: hashedCode,
      type: 'code',
      userId: user.id,
      expiresAt: new Date(Date.now() + fifteenMinutes),
    });
  });

  await sendPasswordResetEmail({
    email,
    code,
    name: user.name,
  });
};

export const verifyPasswordResetCode = async ({
  email,
  code,
}: VerifyPasswordResetCodeInput) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user) throw new AppError('Invalid or expired code', 400);

  const hashedCode = hashToken(code);

  const codeData = await db.query.passwordResetsTable.findFirst({
    where: and(
      eq(passwordResetsTable.userId, user.id),
      eq(passwordResetsTable.tokenHash, hashedCode),
      eq(passwordResetsTable.type, 'code'),
    ),
  });

  if (!codeData) throw new AppError('Invalid or expired code', 400);

  if (new Date() > codeData.expiresAt)
    throw new AppError('Invalid or expired code', 400);

  const resetToken = generateToken();
  const hashedToken = hashToken(resetToken);

  await db.transaction(async (tx) => {
    const deletedCode = await tx
      .delete(passwordResetsTable)
      .where(
        and(
          eq(passwordResetsTable.id, codeData.id),
          eq(passwordResetsTable.userId, user.id),
          eq(passwordResetsTable.type, 'code'),
        ),
      )
      .returning({ id: passwordResetsTable.id });

    if (deletedCode.length === 0)
      throw new AppError('Invalid or expired code', 400);

    await tx.insert(passwordResetsTable).values({
      tokenHash: hashedToken,
      type: 'reset_token',
      userId: user.id,
      expiresAt: new Date(Date.now() + fifteenMinutes),
    });
  });

  return { resetToken };
};

export const resetPassword = async ({
  password,
  resetToken,
}: {
  password: string;
  resetToken: string;
}) => {
  const hashedToken = hashToken(resetToken);

  const tokenData = await db.query.passwordResetsTable.findFirst({
    where: and(
      eq(passwordResetsTable.tokenHash, hashedToken),
      eq(passwordResetsTable.type, 'reset_token'),
    ),
    with: {
      user: { columns: { email: true, name: true } },
    },
  });

  if (!tokenData)
    throw new AppError('Invalid or expired password reset session', 400);

  if (new Date() > tokenData.expiresAt)
    throw new AppError('Invalid or expired password reset session', 400);

  const hashedPassword = await argon.hash(password);

  await db.transaction(async (tx) => {
    const deletedToken = await tx
      .delete(passwordResetsTable)
      .where(
        and(
          eq(passwordResetsTable.id, tokenData.id),
          eq(passwordResetsTable.userId, tokenData.userId),
          eq(passwordResetsTable.type, 'reset_token'),
        ),
      )
      .returning({ id: passwordResetsTable.id });

    if (deletedToken.length === 0)
      throw new AppError('Invalid or expired password reset session', 400);

    await tx
      .update(usersTable)
      .set({ password: hashedPassword })
      .where(eq(usersTable.id, tokenData.userId));

    await tx
      .delete(sessionsTable)
      .where(eq(sessionsTable.userId, tokenData.userId));
  });

  try {
    await sendPasswordChangedEmail({
      email: tokenData.user.email,
      name: tokenData.user.name,
    });
  } catch (error) {
    console.error('Failed to send password changed email', error);
  }
};
