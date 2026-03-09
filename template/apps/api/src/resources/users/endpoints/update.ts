import _ from 'lodash';
import { userSchema } from 'shared';

import { userService } from 'resources/users';

import isAdmin from 'middlewares/isAdmin';
import createEndpoint from 'routes/createEndpoint';
import shouldExist from 'routes/middlewares/shouldExist';

const schema = userSchema.pick({ firstName: true, lastName: true, email: true });

export default createEndpoint({
  method: 'put',
  path: '/:id',
  schema,
  middlewares: [isAdmin, shouldExist('users')],

  async handler(ctx) {
    const { id } = ctx.request.params;

    const nonEmptyValues = _.pickBy(ctx.validatedData, (value) => !_.isUndefined(value));

    const updatedUser = await userService.updateOne({ _id: id }, () => nonEmptyValues);

    return userService.getPublic(updatedUser);
  },
});
