const { join } = require('path');
const config = require('config');

const EmailService = require('./email.helper');

const emailService = new EmailService({
  apiKey: config.sendgridApiKey,
  templatesDir: join(__dirname, '../../assets/emails/dist'),
  from: {
    email: 'notifications@ship.com',
    name: 'SHIP',
  },
});

exports.sendSignUpWelcome = (to, dynamicTemplateData) => emailService.sendTemplate({
  to,
  subject: 'Sign Up',
  template: 'signup-welcome.html',
  dynamicTemplateData,
});

exports.sendForgotPassword = (to, dynamicTemplateData) => emailService.sendSendgridTemplate({
  to,
  subject: 'Welcome',
  templateId: 'your-template-id',
  dynamicTemplateData,
});
