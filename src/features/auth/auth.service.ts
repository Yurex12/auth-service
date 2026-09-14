import { and, desc, eq, ne } from 'drizzle-orm';
import { db } from '../../db/index.js';
import {
  accountsTable,
  passwordResetsTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from '../../db/schema.js';
import { AppError } from '../../utils/app-error.js';
import { fifteenMinutes, thirtyDays } from '../../utils/constant.js';
import { generateToken, generateOTP, hashToken } from '../../utils/token.js';
import {
  sendGoogleAccountLinkedEmail,
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
      .values({ email, name })
      .onConflictDoNothing({ target: usersTable.email })
      .returning();

    if (!user) throw new AppError('Email already exists', 409);

    await tx.insert(accountsTable).values({
      providerId: 'credential',
      accountId: user.id,
      userId: user.id,
      password: hashedPassword,
    });

    await tx.insert(verificationsTable).values({
      token: hashedCode,
      userId: user.id,
      expiresAt: new Date(Date.now() + fifteenMinutes),
    });

    return { user };
  });

  await sendVerificationEmail({ email, code, name });

  return { user };
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
  });

  if (!user) return;

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

  const account = await db.query.accountsTable.findFirst({
    where: (account, { eq, and }) =>
      and(eq(account.providerId, 'credential'), eq(account.userId, user.id)),
    columns: { password: true },
  });

  if (!account?.password)
    throw new AppError('Incorrect Email or password', 400);

  const passwordMatch = await argon.verify(account.password, password);

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

  return { user, sessionToken };
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

  const account = await db.query.accountsTable.findFirst({
    where: (account, { eq, and }) =>
      and(eq(account.providerId, 'credential'), eq(account.userId, user.id)),
    columns: { password: true },
  });

  if (!account?.password)
    throw new AppError(
      'Password authentication is not available for this account',
      400,
    );

  const passwordMatch = await argon.verify(account.password, currentPassword);

  if (!passwordMatch) throw new AppError('Current password is incorrect', 400);

  const hashedPassword = await argon.hash(newPassword);

  await db.transaction(async (tx) => {
    await tx
      .update(accountsTable)
      .set({ password: hashedPassword })
      .where(
        and(
          eq(accountsTable.userId, userId),
          eq(accountsTable.providerId, 'credential'),
        ),
      );

    await tx
      .delete(sessionsTable)
      .where(
        and(eq(sessionsTable.userId, userId), ne(sessionsTable.id, sessionId)),
      );
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
    with: {
      accounts: {
        where: (account, { eq }) => eq(account.providerId, 'credential'),
        columns: { id: true },
      },
    },
  });

  if (!user || user.accounts.length === 0) return;

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
      .update(accountsTable)
      .set({ password: hashedPassword })
      .where(
        and(
          eq(accountsTable.userId, tokenData.userId),
          eq(accountsTable.providerId, 'credential'),
        ),
      );

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
export const authenticateWithGoogle = async (
  {
    name,
    email,
    accountId,
  }: {
    accountId: string;
    email: string;
    name: string | undefined;
  },
  { ipAddress, userAgent }: LoginMetadata,
) => {
  const account = await db.query.accountsTable.findFirst({
    where: (account, { and, eq }) =>
      and(eq(account.accountId, accountId), eq(account.providerId, 'google')),
  });

  const sessionToken = generateToken();
  const hashedSessionToken = hashToken(sessionToken);

  if (account) {
    await db.insert(sessionsTable).values({
      token: hashedSessionToken,
      userId: account.userId,
      expiresAt: new Date(Date.now() + thirtyDays),
      ipAddress,
      userAgent,
    });

    return { sessionToken };
  } else {
    const existingUser = await db.query.usersTable.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (existingUser) return { sessionToken: null, userId: existingUser.id };
    else {
      const { user } = await db.transaction(async (tx) => {
        const [user] = await tx
          .insert(usersTable)
          .values({ email, name: name || 'user', verifiedAt: new Date() })
          .returning();

        if (!user) throw new AppError('Email already exists', 409);

        await tx.insert(accountsTable).values({
          providerId: 'google',
          accountId,
          userId: user.id,
        });

        await tx.insert(sessionsTable).values({
          token: hashedSessionToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + thirtyDays),
          ipAddress,
          userAgent,
        });

        return { user };
      });

      try {
        await sendWelcomeEmail({ email: user.email, name: user.name });
      } catch (error) {
        console.error('Failed to send welcome email', error);
      }
      return { sessionToken };
    }
  }
};

export const linkGoogleAccount = async ({
  userId,
  accountId,
  name,
  email,
}: {
  accountId: string;
  userId: string;
  email: string;
  name: string;
}) => {
  const existingAccount = await db.query.accountsTable.findFirst({
    where: (account, { and, eq }) =>
      and(eq(account.providerId, 'google'), eq(account.accountId, accountId)),
  });

  if (existingAccount) throw new AppError('Google account already linked', 409);

  const existingGoogleAccount = await db.query.accountsTable.findFirst({
    where: (account, { and, eq }) =>
      and(eq(account.providerId, 'google'), eq(account.userId, userId)),
  });

  if (existingGoogleAccount)
    throw new AppError('User already has a Google account linked', 409);

  await db.insert(accountsTable).values({
    accountId,
    providerId: 'google',
    userId,
  });

  try {
    await sendGoogleAccountLinkedEmail({ email, name });
  } catch (error) {
    console.error('Failed to send Google account linked email', error);
  }
};
export const getActiveSessions = async (userId: string) => {
  const sessions = await db.query.sessionsTable.findMany({
    where: (session, { eq, and, gt }) =>
      and(eq(session.userId, userId), gt(session.expiresAt, new Date())),
    orderBy: desc(sessionsTable.createdAt),
  });

  return { sessions };
};
export const revokeSession = async (userId: string, sessionId: string) => {
  const deletedSession = await db
    .delete(sessionsTable)
    .where(
      and(eq(sessionsTable.userId, userId), eq(sessionsTable.id, sessionId)),
    )
    .returning({ id: sessionsTable.id });

  if (deletedSession.length === 0)
    throw new AppError('Session does not exist', 400);
};

export const revokeOtherSessions = async (
  userId: string,
  sessionId: string,
) => {
  await db
    .delete(sessionsTable)
    .where(
      and(eq(sessionsTable.userId, userId), ne(sessionsTable.id, sessionId)),
    );
};

export const revokeAllSessions = async (userId: string) => {
  const deletedSession = await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.userId, userId));
};
