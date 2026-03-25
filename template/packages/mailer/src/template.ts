import { ResetPassword, ResetPasswordProps } from '../emails/reset-password';
import { SignUpWelcome, SignUpWelcomeProps } from '../emails/sign-up-welcome';
import { VerifyEmail, VerifyEmailProps } from '../emails/verify-email';

export type Template = 'reset-password' | 'sign-up-welcome' | 'verify-email';

export const EmailComponent = {
  'reset-password': ResetPassword,
  'sign-up-welcome': SignUpWelcome,
  'verify-email': VerifyEmail,
};

export interface TemplateProps {
  'reset-password': ResetPasswordProps;
  'sign-up-welcome': SignUpWelcomeProps;
  'verify-email': VerifyEmailProps;
}
