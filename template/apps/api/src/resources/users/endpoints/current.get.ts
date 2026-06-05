import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import { publicSchema } from '@/resources/users/users.schema';

export default endpoint
  .use(isAuthorized)
  .output(publicSchema)
  .handler(async ({ context }) => {
    return context.user;
  });
