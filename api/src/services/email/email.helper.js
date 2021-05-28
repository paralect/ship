const { promises: fs } = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const sendgrid = require('@sendgrid/mail');

const render = async (templatePath, templateParams) => {
  const template = await fs.readFile(templatePath);
  const compiledHtml = handlebars.compile(template.toString());

  return compiledHtml(templateParams);
};

class MailService {
  constructor({
    apiKey,
    templatesDir,
    from,
  }) {
    this.apiKey = apiKey;
    this.from = from;
    this.templatesDir = templatesDir;

    sendgrid.setApiKey(apiKey);
  }

  async sendTemplate({
    to, subject, template, dynamicTemplateData,
  }) {
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
    to, subject, templateId, dynamicTemplateData,
  }) {
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

module.exports = MailService;
