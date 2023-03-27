import { join } from 'path';

import config from 'config';

import EmailService from './email.helper';

const emailService = new EmailService({
  apiKey: config.sendgridApiKey,
  templatesDir: join(__dirname, '../../assets/emails/dist'),
  from: {
    email: 'notifications@ship.com',
    name: 'SHIP',
  },
});

const sendVerifyEmail = (to: string, dynamicTemplateData: unknown) => emailService.sendTemplate({
  to,
  subject: 'Confirm email',
  template: 'verify-email.html',
  dynamicTemplateData,
});

const sendSignUpWelcome = (to: string, dynamicTemplateData: unknown) => emailService.sendTemplate({
  to,
  subject: 'Sign Up',
  template: 'signup-welcome.html',
  dynamicTemplateData,
});

const sendForgotPassword = (to: string, dynamicTemplateData: { [key: string]: unknown; }) => emailService.sendTemplate({
  to,
  subject: 'Welcome',
  template: 'reset-password.html',
  dynamicTemplateData,
});

export default {
  sendVerifyEmail,
  sendSignUpWelcome,
  sendForgotPassword,
};
