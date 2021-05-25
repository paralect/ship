const Joi = require('joi');

const emailService = require('services/email.service');
const validate = require('middlewares/validate');
const userService = require('resources/user/user.service');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
    }),
});

async function handler(ctx) {
  const { email } = ctx.validatedData;
  const user = await userService.findOne({ email });

  if (user) {
    await emailService.sendSignupWelcome({
      email,
      signupToken: user.signupToken,
    });
  }

  ctx.body = {};
}

module.exports.register = (router) => {
  router.post('/resend', validate(schema), handler);
};
