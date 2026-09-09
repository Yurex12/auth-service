import axios from 'axios';
import { AppError } from '../../utils/app-error.js';
import type { GoogleTokenResponse } from './auth.types.js';

import { OAuth2Client } from 'google-auth-library';

export async function exchangeGoogleCode(code: string) {
  try {
    const { data } = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Google token exchange failed:', error.response?.data);
    } else {
      console.error('Google token exchange failed:', error);
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
