import { createServerFn } from '@tanstack/react-start';

export const getGreeting = createServerFn({ method: 'GET' }).handler(async () => {
  return { message: 'Hello from a TanStack Start server function' };
});
