export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  accounts: () => [...authKeys.all, 'accounts'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
};

