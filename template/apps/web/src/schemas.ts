import { z } from 'zod';

import { PASSWORD_RULES } from 'app-constants';

export const emailSchema = z
  .email()
  .min(1, 'Email is required')
  .toLowerCase()
  .trim()
  .max(255, 'Email must be less than 255 characters.');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(PASSWORD_RULES.MIN_LENGTH, `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters.`)
  .max(PASSWORD_RULES.MAX_LENGTH, `Password must be less than ${PASSWORD_RULES.MAX_LENGTH} characters.`)
  .regex(
    PASSWORD_RULES.REGEX,
    `The password must contain ${PASSWORD_RULES.MIN_LENGTH} or more characters with at least one letter (a-z) and one number (0-9).`,
  );

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Password must be less than 128 characters.'),
});

export const signUpSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(128, 'Full name must be less than 128 characters.'),
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

export const resendEmailSchema = z.object({
  email: emailSchema,
});

export const accountUpdateSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').max(128, 'Full name must be less than 128 characters.'),
    avatar: z.union([z.any(), z.literal('')]).nullable(),
  })
  .partial();
