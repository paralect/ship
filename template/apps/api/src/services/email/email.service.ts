import config from 'config';
import sendgrid from '@sendgrid/mail';

import { renderEmailHtml, Template } from 'mailer';

import logger from 'logger';

import { From, EmailServiceConstructorProps, SendTemplateParams, SendSendgridTemplateParams } from './email.types';

class EmailService {
  apiKey: string | undefined;

  from: From;

  constructor({ apiKey, from }: EmailServiceConstructorProps) {
    this.apiKey = apiKey;
    this.from = from;

    if (apiKey) sendgrid.setApiKey(apiKey);
  }

  async sendTemplate<T extends Template>({
    to,
    subject,
    template,
    params,
    attachments,
  }: SendTemplateParams<T>) {
    if (!this.apiKey) {
      logger.error('[Sendgrid] API key is not provided');
      return null;
    }

    const html = await renderEmailHtml({ template, params });

    return sendgrid.send({
      from: this.from,
      to,
      subject,
      html,
      attachments,
    }).then(() => {
      logger.debug(`[Sendgrid] Sent email to ${to}.`);
      logger.debug({ subject, template, params });
    });
  }

  async sendSendgridTemplate({
    to,
    subject,
    templateId,
    dynamicTemplateData,
    attachments,
  }: SendSendgridTemplateParams) {
    if (!this.apiKey) {
      logger.error('[Sendgrid] API key is not provided');
      return null;
    }

    return sendgrid.send({
      from: this.from,
      to,
      subject,
      templateId,
      dynamicTemplateData,
      attachments,
    }).then(() => {
      logger.debug(`[Sendgrid] Sent email to ${to}.`);
      logger.debug({ subject, templateId, dynamicTemplateData });
    });
  }
}


export default new EmailService({
  apiKey: config.SENDGRID_API_KEY,
  from: {
    email: 'notifications@ship.com',
    name: 'Ship',
  },
});
