import { NotionMagicLinkEmail, NotionMagicLinkEmailProps } from 'emails/notion-magic-link';
import { PlaidVerifyIdentityEmail, PlaidVerifyIdentityEmailProps } from 'emails/plaid-verify-identity';

export enum Template {
  SIGN_UP_WELCOME,
  VERIFY_EMAIL,
}

export type TemplateProps = {
  [Template.SIGN_UP_WELCOME]: NotionMagicLinkEmailProps;
  [Template.VERIFY_EMAIL]: PlaidVerifyIdentityEmailProps;
};

export const EmailComponent = {
  [Template.SIGN_UP_WELCOME]: NotionMagicLinkEmail,
  [Template.VERIFY_EMAIL]: PlaidVerifyIdentityEmail,
};
