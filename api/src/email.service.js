const { logger } = global;

const _sendEmail = (template, data) => {
  logger.debug(`Sending email [${template}]. The data is: ${JSON.stringify(data)}`);
};

module.exports.sendSignupWelcome = (data) => {
  _sendEmail('signup-welcome', data);
};

module.exports.sendForgotPassword = (data) => {
  _sendEmail('forgot-password', data);
};
