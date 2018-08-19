const { join } = require('path');
const MailService = require('@paralect/email-service');

const {
  mailgun,
  isTest,
  landingUrl,
  apiUrl,
} = require('config');

const { logger } = global;

const mailService = new MailService({
  isSendEmail: !isTest,
  mailgun,
  templatesDir: join(__dirname, './assets/emails/dist'), // absolute path to templates directory
});

const _sendEmail = async (template, emailData, data = {}) => {
  try {
    await mailService.send(
      template,
      data,
      {
        from: 'Excited User <me@samples.mailgun.org>',
        to: emailData.to,
        subject: emailData.subject,
      },
    );
    logger.debug(`Sending email [${template}]. The data is: ${JSON.stringify(data)}`);
  } catch (e) {
    logger.error(`Error in sending email. Data: ${e.message}`);
  }
};

exports.sendSignupWelcome = (data) => {
  _sendEmail(
    'signup-welcome.html',
    {
      subject: 'Signup',
      to: data.email,
    },
    {
      ...data,
      landingUrl,
      apiUrl,
    },
  );
};

exports.sendForgotPassword = (data) => {
  _sendEmail(
    'forgot-password.html',
    {
      subject: 'Forgot Password',
      to: data.email,
    },
    {
      ...data,
      landingUrl,
    },
  );
};
