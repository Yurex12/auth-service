export type LoginMetadata = {
  ipAddress: string | undefined;
  userAgent: string | undefined;
};

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
};
