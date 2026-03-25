import { isAuthorized } from '@/procedures';
import { publicSchema } from '@/resources/users/users.schema';

export default isAuthorized.output(publicSchema).handler(async ({ context }) => {
  return context.user;
});
