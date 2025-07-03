import _ from 'lodash';
import { z } from 'zod';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';

import { userSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next } from 'types';

const schema = userSchema.pick({ firstName: true, lastName: true, email: true });

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { id } = ctx.request.params;

  ctx.assertError(id, 'User ID is required');

  const isUserExists = await userService.exists({ _id: id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { id } = ctx.request.params;

  const nonEmptyValues = _.pickBy(ctx.validatedData, (value) => !_.isUndefined(value));

  const updatedUser = await userService.updateOne({ _id: id }, () => nonEmptyValues);

  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.put('/:id', validateMiddleware(schema), validator, handler);
};
