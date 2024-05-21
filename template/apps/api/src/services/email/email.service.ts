import { renderEmailHtml, Template } from 'mailer';
import { Resend } from 'resend';

import config from 'config';

import logger from 'logger';

import { EmailServiceConstructorProps, From, SendTemplateParams } from './email.types';

let resend: Resend;

class EmailService {
  apiKey: string | undefined;

  from: From;

  constructor({ apiKey, from }: EmailServiceConstructorProps) {
    this.apiKey = apiKey;
    this.from = from;

    if (apiKey) {
      resend = new Resend(apiKey);
    }
  }

  async sendTemplate<T extends Template>({ to, subject, template, params, attachments }: SendTemplateParams<T>) {
    if (!this.apiKey) {
      logger.error('[Resend] API key is not provided');
      return null;
    }

    const html = await renderEmailHtml({ template, params });

    return resend.emails
      .send({
        from: `${this.from.name} <${this.from.email}>`,
        to,
        subject,
        html,
        attachments,
      })
      .then(() => {
        logger.debug(`[Resend] Sent email to ${to}.`);
        logger.debug({ subject, template, params });
      });
  }
}

export default new EmailService({
  apiKey: config.RESEND_API_KEY,
  from: {
    email: 'notifications@ship.com',
    name: 'Ship',
  },
});
