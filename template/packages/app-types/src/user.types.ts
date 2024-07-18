import { z } from 'zod';

import { emailSchema, resetPasswordSchema, signInSchema, signUpSchema, updateUserSchema, userSchema } from 'schemas';

export type User = z.infer<typeof userSchema>;

export type SignInParams = z.infer<typeof signInSchema>;
export type SignUpParams = z.infer<typeof signUpSchema>;
export type EmailParams = z.infer<typeof emailSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>;
export type UpdateUserParams = z.infer<typeof updateUserSchema>;
