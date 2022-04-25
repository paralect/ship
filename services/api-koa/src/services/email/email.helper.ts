import path from 'path';
import handlebars from 'handlebars';
import sendgrid from '@sendgrid/mail';
import fs from 'fs/promises';

const render = async (templatePath: string, templateParams: unknown) => {
  const template = await fs.readFile(templatePath);
  const compiledHtml = handlebars.compile(template.toString());

  return compiledHtml(templateParams);
};

type From = { email: string, name: string };
class MailService {
  apiKey: string;

  from: From;

  templatesDir: string;

  constructor({
    apiKey,
    templatesDir,
    from,
  }: { apiKey: string, templatesDir: string, from: From }) {
    this.apiKey = apiKey;
    this.from = from;
    this.templatesDir = templatesDir;

    sendgrid.setApiKey(apiKey);
  }

  async sendTemplate({
    to,
    subject,
    template,
    dynamicTemplateData,
  }: { to: string, subject: string, template: string, dynamicTemplateData: unknown }) {
    if (!this.apiKey) return null;

    const templatePath = path.join(this.templatesDir, template);
    const html = await render(templatePath, dynamicTemplateData);

    return sendgrid.send({
      to,
      from: this.from,
      subject,
      html,
    });
  }

  async sendSendgridTemplate({
    to,
    subject,
    templateId,
    dynamicTemplateData,
  }: { to: string, subject: string, templateId: string, dynamicTemplateData: { [key: string]: unknown; } }) {
    if (!this.apiKey) return null;

    return sendgrid.send({
      to,
      from: this.from,
      subject,
      templateId,
      dynamicTemplateData,
    });
  }
}

export default MailService;
