import { eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { sessionsTable } from '../db/schema.js';
import { AppError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';
import { hashToken } from '../utils/token.js';

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
    with: { user: { with: { role: { columns: { name: true } } } } },
  });

  if (!userSession) throw new AppError('unauthorized', 401);

  if (new Date() > userSession.expiresAt) {
    try {
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.id, userSession.id));
    } catch (error) {
      logger.error({ err: error }, 'Failed to delete expired session');
    }

    throw new AppError('Session has expired', 401);
  }

  req.user = userSession.user;
  req.userId = userSession.userId;
  req.sessionId = userSession.id;

  next();
};
