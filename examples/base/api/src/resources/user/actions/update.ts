import Joi from 'joi';

import { Next, AppKoaContext, AppRouter } from 'types';
import validate from 'middlewares/validate.middleware';
import userService from 'resources/user/user.service';
import { User } from 'resources/user/user.types';

const schema = Joi.object({
  firstName: Joi.string()
    .required(),
  lastName: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
});

type ValidatedData = {
  firstName: string,
  lastName: string,
  email: string
};
type Request = {
  params: {
    id: string;
  }
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isUserExists = await userService.exists({ _id: ctx.request.params.id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { firstName, lastName, email } = ctx.validatedData;

  const updatedUser = await userService.update(
    { _id: ctx.request.params?.id },
    () => ({ firstName, lastName, email }),
  ) as User;

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validate(schema), handler);
};
