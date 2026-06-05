import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';

export default endpoint
  .use(isAuthorized)
  .route({ method: 'GET', path: '/notes' })
  .handler(async ({ context }) => {
  const { results } = await db.notes.find({ userId: context.user._id });

  return results;
});
