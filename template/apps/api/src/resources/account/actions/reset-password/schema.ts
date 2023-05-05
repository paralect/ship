import { z } from 'zod';

export const schema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});
