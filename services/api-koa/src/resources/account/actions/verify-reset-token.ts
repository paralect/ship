import Joi from 'joi';
import validate from 'middlewares/validate.middleware';
import userService from 'resources/user/user.service';
import config from 'config';
import { AppKoaContext, AppRouter } from 'types';

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

type ValidatedData = {
  token: string;
  email: string;
};

async function validator(ctx: AppKoaContext<ValidatedData>) {
  const { email, token } = ctx.validatedData;

  const user = await userService.findOne({ resetPasswordToken: token });

  if (user) {
    ctx.redirect(`${config.webUrl}/reset-password?token=${token}`);
  } else {
    ctx.redirect(`${config.webUrl}/expire-token?email=${email}`);
  }
}

export default (router: AppRouter) => {
  router.get('/verify-reset-token', validate(schema), validator);
};
