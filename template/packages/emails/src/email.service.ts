import type { Template, TemplateProps } from './template';
import { renderEmailHtml } from './utils';
import { Resend } from 'resend';
import { Buffer } from 'node:buffer';

interface From {
  email: string;
  name: string;
}

interface Attachment {
  content?: string | Buffer;
  filename?: string | false | undefined;
  path?: string;
}

interface SendTemplateParams<T extends Template> {
  to: string | string[];
  subject: string;
  template: T;
  params: TemplateProps[T];
  attachments?: Attachment[];
}

class EmailService {
  resend?: Resend;
  apiKey: string | undefined;
  from: From;

  constructor({ apiKey, from }: { apiKey: string | undefined; from: From }) {
    this.apiKey = apiKey;
    this.from = from;

    if (apiKey) this.resend = new Resend(apiKey);
  }

  async sendTemplate<T extends Template>({ to, subject, template, params, attachments }: SendTemplateParams<T>) {
    if (!this.resend) {
      console.error('[Resend] API key is not provided');
      console.debug('[Resend] Email data:', { subject, template, params });

      return null;
    }

    const html = await renderEmailHtml({ template, params });

    return this.resend.emails
      .send({
        from: `${this.from.name} <${this.from.email}>`,
        to,
        subject,
        html,
        attachments,
      })
      .then(() => {
        console.debug(`[Resend] Sent email to ${to}.`);
        console.debug('[Resend]', { subject, template, params });
      });
  }
}

export default new EmailService({
  apiKey: process.env.RESEND_API_KEY,
  from: {
    email: process.env.RESEND_FROM_EMAIL || 'no-reply@ship.paralect.com',
    name: process.env.RESEND_FROM_NAME || 'Ship',
  },
});
