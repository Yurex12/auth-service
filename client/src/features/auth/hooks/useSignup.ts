import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { signupApi } from '../api/authApi';
import type { SignupFormValues } from '../schemas/authSchema';

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupFormValues) => signupApi(data),
    onSuccess: (data) =>
      toast.success(data.message || 'Account created successfully'),
    onError: (error) => toast.error(error.message || 'Signup failed'),
  });
}
