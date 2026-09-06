import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import {
  sessionsTable,
  usersTable,
  verificationsTable,
} from '../../db/schema.js';
import { AppError } from '../../utils/app-error.js';
import { fifteenMinutes, thirtyDays } from '../../utils/constant.js';
import {
  generateSessionToken,
  generateVerificationToken,
  hashToken,
} from '../../utils/token.js';
import { sendVerificationEmail, sendWelcomeEmail } from './auth.email.js';
import type {
  loginInput,
  resendVerificationInput,
  signupInput,
  verifyEmailInput,
} from './auth.schema.js';

import argon from 'argon2';
import type { LoginMetadata } from './auth.types.js';

export const createUser = async (userData: signupInput) => {
  const { name, email, password } = userData;

  const hashedPassword = await argon.hash(password);

  const token = generateVerificationToken();
  const hashedToken = hashToken(token);

  const { user } = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(usersTable)
      .values({ email, name, password: hashedPassword })
      .onConflictDoNothing({ target: usersTable.email })
      .returning();

    if (!user) throw new AppError('Email already exists', 409);

    await tx.insert(verificationsTable).values({
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + fifteenMinutes),
    });

    return { user };
  });

  await sendVerificationEmail({ email, token, name });

  const { password: _, ...newUser } = user;

  return { ...newUser };
};

export const verifyUserEmail = async (userData: verifyEmailInput) => {
  const hashedToken = hashToken(userData.token);

  const user = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, userData.email),
    columns: { verifiedAt: true, name: true, id: true },
  });

  if (!user) throw new AppError('Invalid code', 400);

  if (user.verifiedAt) throw new AppError('User already verified', 400);

  const tokenData = await db.query.verificationsTable.findFirst({
    where: (verification, { eq, and }) =>
      and(
        eq(verification.userId, user.id),
        eq(verification.token, hashedToken),
      ),
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
}: resendVerificationInput) => {
  const user = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
    columns: { password: false },
  });

  if (!user)
    throw new AppError('Verification code has been sent to your mail', 404);

  if (user.verifiedAt) throw new AppError('User already verified', 400);

  const token = generateVerificationToken();
  const hashedToken = hashToken(token);

  await db.transaction(async (tx) => {
    await tx
      .delete(verificationsTable)
      .where(eq(verificationsTable.userId, user.id));

    await tx.insert(verificationsTable).values({
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + fifteenMinutes),
    });
  });

  await sendVerificationEmail({ email, token, name: user.name });

  return { user };
};

export const loginUser = async (
  { email, password }: loginInput,
  { ipAddress, userAgent }: LoginMetadata,
) => {
  const user = await db.query.usersTable.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  if (!user) throw new AppError('Incorrect Email or password', 400);

  const passwordMatch = await argon.verify(user.password, password);

  if (!passwordMatch) throw new AppError('Incorrect Email or password', 400);

  if (!user.verifiedAt) throw new AppError('Email not verified', 400);

  const sessionToken = generateSessionToken();
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
