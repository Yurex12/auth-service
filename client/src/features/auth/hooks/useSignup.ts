import { useMutation } from '@tanstack/react-query';
import { signupApi } from '../api/authApi';
import type { SignupInput } from '../schemas/authSchema';

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupInput) => signupApi(data),
  });
}
