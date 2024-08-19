import { z } from 'zod';

import {
  forgotPasswordSchema,
  resendEmailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateUserSchema,
  userSchema,
} from 'schemas';

export type User = z.infer<typeof userSchema>;

export type SignInParams = z.infer<typeof signInSchema>;
export type SignUpParams = z.infer<typeof signUpSchema>;
export type ResendEmailParams = z.infer<typeof resendEmailSchema>;
export type ForgotPasswordParams = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>;
export type UpdateUserParams = z.infer<typeof updateUserSchema>;
