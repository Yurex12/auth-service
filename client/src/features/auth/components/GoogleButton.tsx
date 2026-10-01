import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from './GoogleIcon';
import type { GoogleButtonProps } from '../types/authTypes';

export function GoogleButton({ disabled }: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    setIsLoading(true);
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <GoogleIcon className="size-4" />
      )}
      <span>Continue with Google</span>
    </Button>
  );
}
