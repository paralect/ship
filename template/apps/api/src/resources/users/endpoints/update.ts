import _ from 'lodash';

import { userService } from 'resources/users';

import { isAdmin } from 'routes/middlewares';
import { createEndpoint } from 'routes/types';

import { userSchema } from '../user.schema';

export const schema = userSchema.pick({ firstName: true, lastName: true, email: true });

export default createEndpoint({
  method: 'put',
  path: '/:id',
  schema,
  middlewares: [isAdmin],

  async handler(ctx) {
    const { id } = ctx.request.params;

    if (!id) {
      ctx.throwError('User ID is required');
    }

    const isUserExists = await userService.exists({ _id: id });

    if (!isUserExists) {
      ctx.throwError('User not found');
    }

    const nonEmptyValues = _.pickBy(ctx.validatedData, (value) => !_.isUndefined(value));

    const updatedUser = await userService.updateOne({ _id: id }, () => nonEmptyValues);

    return userService.getPublic(updatedUser);
  },
});
