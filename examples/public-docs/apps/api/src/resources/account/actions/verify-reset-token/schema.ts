import { z } from 'zod';

export const schema = z.object({
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  token: z.string().min(1, 'Token is required'),
});
