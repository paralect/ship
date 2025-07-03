import { z } from 'zod';

import { emailSchema, passwordSchema } from './common.schema';
import { userSchema } from './user.schema';

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).max(128, 'Password must be less than 128 characters.'),
});

export const signUpSchema = userSchema.pick({ firstName: true, lastName: true }).extend({
  email: emailSchema,
  password: passwordSchema,
});

export const resendEmailSchema = z.object({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token is required' }),
  password: passwordSchema,
});
