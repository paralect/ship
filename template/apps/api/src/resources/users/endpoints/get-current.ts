import { isAuthorized } from '@/procedures';
import { publicSchema } from '@/resources/users/drizzle.schema';

export default isAuthorized.output(publicSchema).handler(async ({ context }) => {
  return context.user;
});
