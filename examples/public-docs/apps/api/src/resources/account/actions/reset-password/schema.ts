import { z } from 'zod';
import { PASSWORD_REGEXP } from 'app.constants';

export const schema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().regex(
    PASSWORD_REGEXP,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});
