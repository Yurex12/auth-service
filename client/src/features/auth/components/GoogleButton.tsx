import { Button } from '@/components/ui/button';
import { GoogleIcon } from './GoogleIcon';
import type { GoogleButtonProps } from '../types/authTypes';

export function GoogleButton({ onClick, disabled }: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      onClick={onClick}
      disabled={disabled}
    >
      <GoogleIcon className="size-4" />
      <span>Continue with Google</span>
    </Button>
  );
}
