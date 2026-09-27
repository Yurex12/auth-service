import axios from 'axios';
import { AppError } from '../../utils/app-error.js';
import { logger } from '../../utils/logger.js';
import type { GoogleTokenResponse } from './auth.types.js';

import { OAuth2Client } from 'google-auth-library';
import { hashToken } from '../../utils/token.js';

export async function exchangeGoogleCode(code: string, redirectURI: string) {
  try {
    const { data } = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: redirectURI,
        grant_type: 'authorization_code',
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error({ data: error.response?.data }, 'Google token exchange failed');
    } else {
      logger.error({ err: error }, 'Google token exchange failed');
    }

    throw new AppError('Google authentication failed', 400);
  }
}

export const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

export function verifyGoogleIdToken(token: string) {
  return googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });
}

type OAuthLinkData = {
  accountId: string;
  expiresAt: number;
  userId: string;
};

export const createOAuthLinkToken = (data: OAuthLinkData) => {
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = hashToken(encodedData);

  return `${encodedData}.${signature}`;
};

export const verifyOAuthLinkToken = (token: string): OAuthLinkData => {
  const [encodedData, signature] = token.split('.');

  if (!encodedData || !signature)
    throw new AppError('Invalid OAuth link token', 400);

  const expectedSignature = hashToken(encodedData);

  if (signature !== expectedSignature)
    throw new AppError('Invalid OAuth link token', 400);

  try {
    const data = JSON.parse(
      Buffer.from(encodedData, 'base64url').toString('utf8'),
    ) as OAuthLinkData;

    if (Date.now() > data.expiresAt)
      throw new AppError('OAuth link token expired', 400);

    return data;
  } catch {
    throw new AppError('Invalid OAuth link token', 400);
  }
};
