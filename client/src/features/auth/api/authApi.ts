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
  VerifyEmailInput,
  VerifyPasswordResetCodeInput,
  ResetPasswordInput,
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

export async function verifyEmailApi(data: VerifyEmailInput): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/verify-email', data);
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

