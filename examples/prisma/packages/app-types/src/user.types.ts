import { z } from 'zod';

import {
  forgotPasswordSchema,
  resendEmailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateUserSchema,
} from 'schemas';

import { BackendFile, FrontendFile } from './common.types';

export type SignInParams = z.infer<typeof signInSchema>;
export type SignUpParams = z.infer<typeof signUpSchema>;
export type ResendEmailParams = z.infer<typeof resendEmailSchema>;
export type ForgotPasswordParams = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>;
export type UpdateUserParams = z.infer<typeof updateUserSchema>;

export type UpdateUserParamsFrontend = Omit<UpdateUserParams, 'avatar'> & {
  avatar?: FrontendFile | string;
};

export type UpdateUserParamsBackend = Omit<UpdateUserParams, 'avatar'> & {
  avatar?: BackendFile | string;
};
