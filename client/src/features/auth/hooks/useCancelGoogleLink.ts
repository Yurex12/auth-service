import { useMutation } from '@tanstack/react-query';
import { cancelGoogleLinkApi } from '../api/authApi';

export function useCancelGoogleLink() {
  return useMutation({
    mutationFn: cancelGoogleLinkApi,
  });
}
