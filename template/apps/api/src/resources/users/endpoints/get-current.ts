import { authed } from 'procedures';

import { publicSchema } from 'resources/users/users.schema';

export default authed.output(publicSchema).handler(async ({ context }) => {
  return context.user;
});
