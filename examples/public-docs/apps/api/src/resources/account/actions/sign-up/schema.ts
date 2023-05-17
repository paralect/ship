import { z } from 'zod';
import { PASSWORD_REGEXP } from 'app.constants';

export const schema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().regex(
    PASSWORD_REGEXP,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});
