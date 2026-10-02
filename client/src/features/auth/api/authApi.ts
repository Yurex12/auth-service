import apiClient from '@/lib/axios';
import type { ApiResponse } from '@/types/apiTypes';
import type {
  LoginFormValues,
  SignupFormValues,
  ResendVerificationFormValues,
  RequestPasswordResetFormValues,
} from '../schemas/authSchema';
import type {
  AuthResponse,
  UserAccountsResponse,
  VerifyEmailInput,
  VerifyPasswordResetCodeInput,
  ResetPasswordInput,
  SetPasswordInput,
  VerifySetPasswordCodeInput,
  ChangePasswordInput,
  SessionsResponse,
} from '../types/authTypes';

export async function loginApi(data: LoginFormValues): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function signupApi(data: SignupFormValues): Promise<AuthResponse> {
  const { confirmPassword: _, ...payload } = data;
  const response = await apiClient.post<AuthResponse>('/auth/signup', payload);
  return response.data;
}

export async function verifyEmailApi(
  data: VerifyEmailInput,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/auth/verify-email',
    data,
  );
  return response.data;
}

export async function resendVerificationApi(
  data: ResendVerificationFormValues,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/resend-verification',
    data,
  );
  return response.data;
}

export async function requestPasswordResetApi(
  data: RequestPasswordResetFormValues,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/password-reset',
    data,
  );
  return response.data;
}

export async function verifyPasswordResetCodeApi(
  data: VerifyPasswordResetCodeInput,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/password-reset/verify',
    data,
  );
  return response.data;
}

export async function resetPasswordApi(
  data: ResetPasswordInput,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/password-reset/confirm',
    data,
  );
  return response.data;
}

export async function logoutApi(): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>('/auth/logout');
  return response.data;
}

export async function getCurrentUserApi(): Promise<AuthResponse> {
  const response = await apiClient.get<AuthResponse>('/auth/me');
  return response.data;
}

export async function confirmGoogleLinkApi(): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>('/auth/google/link');
  return response.data;
}

export async function cancelGoogleLinkApi(): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>('/auth/google/link/cancel');
  return response.data;
}

export async function getUserAccountsApi(): Promise<UserAccountsResponse> {
  const response = await apiClient.get<UserAccountsResponse>('/auth/accounts');
  return response.data;
}

export async function unlinkGoogleAccountApi(): Promise<ApiResponse> {
  const response = await apiClient.delete<ApiResponse>('/auth/google/unlink');
  return response.data;
}

export async function requestSetPasswordApi(): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/set-password/request',
  );
  return response.data;
}

export async function verifySetPasswordCodeApi(
  data: VerifySetPasswordCodeInput,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/set-password/verify',
    data,
  );
  return response.data;
}

export async function setPasswordApi(
  data: SetPasswordInput,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/set-password',
    data,
  );
  return response.data;
}

export async function changePasswordApi(
  data: ChangePasswordInput,
): Promise<ApiResponse> {
  const response = await apiClient.post<ApiResponse>(
    '/auth/change-password',
    data,
  );
  return response.data;
}

export async function getSessionsApi(): Promise<SessionsResponse> {
  const response = await apiClient.get<SessionsResponse>('/auth/sessions');
  return response.data;
}

export async function revokeSessionApi(id: string): Promise<ApiResponse> {
  const response = await apiClient.delete<ApiResponse>(`/auth/sessions/${id}`);
  return response.data;
}

export async function revokeOtherSessionsApi(): Promise<ApiResponse> {
  const response = await apiClient.delete<ApiResponse>('/auth/sessions/others');
  return response.data;
}

export async function revokeAllSessionsApi(): Promise<ApiResponse> {
  const response = await apiClient.delete<ApiResponse>('/auth/sessions');
  return response.data;
}


