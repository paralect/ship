import { z } from 'zod';

import { forgotPasswordSchema, resendEmailSchema, resetPasswordSchema, signInSchema, signUpSchema } from 'schemas';

export type SignInParams = z.infer<typeof signInSchema>;
export type SignUpParams = z.infer<typeof signUpSchema>;
export type ResendEmailParams = z.infer<typeof resendEmailSchema>;
export type ForgotPasswordParams = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>;
