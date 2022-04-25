import Joi from 'joi';
import validate from 'middlewares/validate.middleware';
import securityUtil from 'utils/security.util';
import userService from 'resources/user/user.service';
import emailService from 'services/email/email.service';
import config from 'config';
import { User } from 'resources/user';
import { AppKoaContext, Next, AppRouter } from 'types';


const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'First name is required',
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name is required',
    }),
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
  password: Joi.string()
    .trim()
    .min(6)
    .max(50)
    .required()
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be 6-50 characters',
      'string.max': 'Password must be 6-50 characters',
    }),
});

type ValidatedData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  user: User;
};

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });
  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    firstName,
    lastName,
    email,
    password,
  } = ctx.validatedData;

  const [hash, signupToken] = await Promise.all([
    securityUtil.getHash(password),
    securityUtil.generateSecureToken(),
  ]);

  const user = await userService.create({
    firstName,
    lastName,
    email,
    passwordHash: hash.toString(),
    isEmailVerified: false,
    signupToken,
  });

  await emailService.sendSignUpWelcome(user.email, {
    verifyEmailUrl: `${config.apiUrl}/account/verify-email?token=${signupToken}`,
  });

  ctx.body = config.isDev ? { signupToken } : {};
}

export default (router: AppRouter) => {
  router.post('/sign-up', validate(schema), validator, handler);
};
