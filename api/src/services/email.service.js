const { join } = require('path');
const MailService = require('@paralect/email-service');

const config = require('config');
const logger = require('logger');

const mailService = new MailService({
  isSendEmail: !config.isTest,
  mailgun: config.mailgun,
  templatesDir: join(__dirname, './assets/emails/dist'), // absolute path to templates directory
});

const sendEmail = async (template, { to, subject }, data = {}) => {
  try {
    await mailService.send(
      template,
      data,
      {
        from: 'Excited User <me@samples.mailgun.org>',
        to,
        subject,
      },
    );
    logger.debug(`Sending email [${template}]. The data is: ${JSON.stringify(data)}`);
  } catch (e) {
    logger.error(`Error in sending email. Data: ${e.message}`);
  }
};

exports.sendSignupWelcome = ({ email, signupToken }) => {
  return sendEmail(
    'signup-welcome.html',
    {
      subject: 'Sign Up',
      to: email,
    },
    {
      verifyEmailUrl: `${config.apiUrl}/account/verify-email?token=${signupToken}`,
    },
  );
};

exports.sendForgotPassword = ({ email, firstName, resetPasswordToken }) => {
  return sendEmail(
    'forgot-password.html',
    {
      subject: 'Forgot Password',
      to: email,
    },
    {
      firstName,
      resetPasswordUrl: `${config.webUrl}/reset?token=${resetPasswordToken}`,
    },
  );
};
