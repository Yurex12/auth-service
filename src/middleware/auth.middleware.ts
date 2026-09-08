import type { NextFunction, Response, Request } from 'express';
import { AppError } from '../utils/app-error.js';
import { hashToken } from '../utils/token.js';
import { db } from '../db/index.js';
import { sessionsTable, usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = req.cookies.session;

  if (!session) throw new AppError('unauthorized', 401);

  const hashedSessionToken = hashToken(session);

  const userSession = await db.query.sessionsTable.findFirst({
    where: (session, { eq }) => eq(session.token, hashedSessionToken),
    with: {
      user: {
        columns: { password: false },
      },
    },
  });

  if (!userSession) throw new AppError('unauthorized', 401);

  if (new Date() > userSession.expiresAt) {
    try {
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.id, userSession.id));
    } catch (error) {
      console.error('Failed to delete expired session', error);
    }

    throw new AppError('Session has expired', 401);
  }

  req.user = userSession.user;
  req.userId = userSession.userId;
  req.sessionId = userSession.id;

  next();
};
