import { SignUpWelcome, SignUpWelcomeProps } from 'emails/sign-up-welcome';

export enum Template {
  SIGN_UP_WELCOME,
}

export const EmailComponent = {
  [Template.SIGN_UP_WELCOME]: SignUpWelcome,
};

export type TemplateProps = {
  [Template.SIGN_UP_WELCOME]: SignUpWelcomeProps;
};
