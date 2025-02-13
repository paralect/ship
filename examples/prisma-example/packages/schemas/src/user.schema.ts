import { z } from 'zod';

import { USER_AVATAR } from 'app-constants';

import { emailSchema, fileSchema, passwordSchema } from './common.schema';

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, 'Please enter First name').max(100),
  lastName: z.string().min(1, 'Please enter Last name').max(100),
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
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

export const updateUserSchema = z
    .object({
        firstName: z.string().min(1, 'Please enter First name').max(100).optional(),
        lastName: z.string().min(1, 'Please enter Last name').max(100).optional(),

        password: z.union([passwordSchema, z.literal('')]), // Позволяет пустую строку
        avatar: z.union([
            fileSchema(USER_AVATAR.MAX_FILE_SIZE, USER_AVATAR.ACCEPTED_FILE_TYPES).nullable(),
            z.literal(''),
        ]),
    })
    .partial();
