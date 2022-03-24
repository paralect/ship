const Joi = require('joi');

const config = require('config');
const validate = require('middlewares/validate.middleware');
const userService = require('resources/user/user.service');

const schema = Joi.object({
  email: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
    }),
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required',
      'string.empty': 'Token is required',
    }),
});

async function validator(ctx) {
  const { email, token } = ctx.validatedData;

  const user = await userService.findOne({ resetPasswordToken: token });

  if (user) {
    ctx.redirect(`${config.webUrl}/reset-password?token=${token}`);
  } else {
    ctx.redirect(`${config.webUrl}/expire-token?email=${email}`);
  }
}

module.exports.register = (router) => {
  router.get('/verify-reset-token', validate(schema), validator);
};
