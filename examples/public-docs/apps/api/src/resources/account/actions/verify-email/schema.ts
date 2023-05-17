import { z } from 'zod';

export const schema = z.object({
  token: z.string().min(1, 'Token is required'),
});
