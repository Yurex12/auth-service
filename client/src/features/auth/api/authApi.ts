import apiClient from '@/lib/axios';
import type { LoginInput, SignupInput } from '../schemas/authSchema';
import type { AuthResponse, User } from '../types/authTypes';

export const loginApi = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const signupApi = async (data: SignupInput): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', data);
  return response.data;
};

export const logoutApi = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/auth/logout');
  return response.data;
};

export const getCurrentUserApi = async (): Promise<{ success: boolean; message: string; user: User }> => {
  const response = await apiClient.get<{ success: boolean; message: string; user: User }>('/auth/me');
  return response.data;
};
