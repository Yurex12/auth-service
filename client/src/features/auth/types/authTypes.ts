import type { ApiResponse } from '@/types/apiTypes';

export type User = {
  id: string;
  email: string;
  name: string;
  roleId: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = ApiResponse & {
  user: User;
};

export type GoogleButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export type VerifyEmailInput = {
  email: string;
  code: string;
};

export type ResendVerificationInput = {
  email: string;
};

export type VerifyPasswordResetCodeInput = {
  email: string;
  code: string;
};

export type ResetPasswordInput = {
  password: string;
};

