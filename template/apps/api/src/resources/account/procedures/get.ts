import { authed } from 'procedures';

import { userService } from 'resources/users';
import { userPublicSchema } from 'resources/users/user.schema';

const publicUserOutput = userPublicSchema;

export default authed.output(publicUserOutput).handler(async ({ context }) => {
  return userService.getPublic(context.user);
});
