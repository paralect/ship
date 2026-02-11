import _ from 'lodash';

import { userService } from 'resources/users';

import { isAdmin } from 'routes/middlewares';
import { createEndpoint, createMiddleware } from 'routes/types';

import { userSchema } from '../user.schema';

export const schema = userSchema.pick({ firstName: true, lastName: true, email: true });

const validator = createMiddleware(async (ctx, next) => {
  const { id } = ctx.params;

  ctx.assertError(id, 'User ID is required');

  const isUserExists = await userService.exists({ _id: id });

  ctx.assertError(isUserExists, 'User not found');

  await next();
});

export default createEndpoint({
  method: 'put',
  path: '/:id',
  schema,
  middlewares: [isAdmin, validator],

  async handler(ctx) {
    const { id } = ctx.request.params;

    const nonEmptyValues = _.pickBy(ctx.validatedData, (value) => !_.isUndefined(value));

    const updatedUser = await userService.updateOne({ _id: id }, () => nonEmptyValues);

    return userService.getPublic(updatedUser);
  },
});
