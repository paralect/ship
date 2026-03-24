import { authed } from 'procedures';

import getPublic from 'resources/users/methods/getPublic';
import { publicSchema } from 'resources/users/users.schema';

const publicUserOutput = publicSchema;

export default authed.output(publicUserOutput).handler(async ({ context }) => {
  return getPublic(context.user);
});
