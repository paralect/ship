import { z } from 'zod';

import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';

export const signInSchema = z.object({
  email: z.string().toLowerCase().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
    ),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
  email: z.string().toLowerCase().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
    ),
});

export const emailSchema = z.object({
  email: z.string().toLowerCase().regex(EMAIL_REGEX, 'Email format is incorrect.'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
    ),
});

export const updateUserSchema = z
  .object({
    firstName: z.string().min(1, 'Please enter First name').max(100).optional(),
    lastName: z.string().min(1, 'Please enter Last name').max(100).optional(),
    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
      )
      .optional(),
  })
  .strict();
