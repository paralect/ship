import config from 'config';
import sendgrid from '@sendgrid/mail';

import { renderEmailHtml, Template } from 'mailer';

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
    if (!this.apiKey) return null;

    const html = await renderEmailHtml({ template, params });

    return sendgrid.send({
      from: this.from,
      to,
      subject,
      html,
      attachments,
    });
  }

  async sendSendgridTemplate({
    to,
    subject,
    templateId,
    dynamicTemplateData,
    attachments,
  }: SendSendgridTemplateParams) {
    if (!this.apiKey) return null;

    return sendgrid.send({
      from: this.from,
      to,
      subject,
      templateId,
      dynamicTemplateData,
      attachments,
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
