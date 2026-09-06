import crypto from 'node:crypto';

export const generateVerificationToken = () =>
  crypto.randomInt(100_000, 1_000_000).toString();

export const hashToken = (token: string) =>
  crypto
    .createHmac('sha256', process.env.TOKEN_HASH_SECRET!)
    .update(token)
    .digest('hex');

export const generateSessionToken = () =>
  crypto.randomBytes(32).toString('hex');
