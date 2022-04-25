import Joi from 'joi';
import validate from 'middlewares/validate.middleware';
import securityUtil from 'utils/security.util';
import userService from 'resources/user/user.service';
import emailService from 'services/email/email.service';
import config from 'config';
import { AppKoaContext, Next, AppRouter } from 'types';
import { User } from 'resources/user';

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

type ValidatedData = {
  email: string;
  user: User;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const user = await userService.findOne({ email: ctx.validatedData.email });

  if (!user) {
    ctx.body = {};
    return;
  }

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  let { resetPasswordToken } = user;

  if (!resetPasswordToken) {
    resetPasswordToken = await securityUtil.generateSecureToken();
    await userService.update({ _id: user._id }, () => ({
      resetPasswordToken,
    }));
  }

  await emailService.sendForgotPassword(
    user.email,
    {
      firstName: user.firstName,
      resetPasswordUrl: `${config.apiUrl}/account/verify-reset-token?token=${resetPasswordToken}&email=${user.email}`,
    },
  );

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.post('/forgot-password', validate(schema), validator, handler);
};
