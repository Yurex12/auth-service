import crypto from 'node:crypto';

export const generateOTP = () =>
  crypto.randomInt(100_000, 1_000_000).toString();

export const generateToken = () => crypto.randomBytes(32).toString('hex');

export const hashToken = (token: string) =>
  crypto
    .createHmac('sha256', process.env.TOKEN_HASH_SECRET!)
    .update(token)
    .digest('hex');
