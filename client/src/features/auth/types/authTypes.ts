export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
