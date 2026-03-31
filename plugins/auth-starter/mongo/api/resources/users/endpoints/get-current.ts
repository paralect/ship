import { isAuthorized } from '@/procedures';
import { publicSchema } from '@/resources/users/users.schema';

export default isAuthorized
  .route({ method: 'GET', path: '/users/current' })
  .output(publicSchema)
  .handler(async ({ context }) => {
  return context.user;
});
