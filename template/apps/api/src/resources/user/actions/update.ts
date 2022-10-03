import Joi from 'joi';

import { AppKoaContext, Next, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService, User } from 'resources/user';

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

  const updatedUser = await userService.updateOne(
    { _id: ctx.request.params?.id },
    () => ({ firstName, lastName, email }),
  );

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validateMiddleware(schema), handler);
};
