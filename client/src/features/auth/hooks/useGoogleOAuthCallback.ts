import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export function useGoogleOAuthCallback() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      toast.error(error || 'Google authentication failed', {
        id: 'google-oauth-error',
      });
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
}
