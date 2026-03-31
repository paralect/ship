import db from '@/db';
import { isAuthorized } from '@/procedures';

export default isAuthorized
  .route({ method: 'GET', path: '/notes' })
  .handler(async ({ context }) => {
  const { results } = await db.notes.find({ userId: context.user._id });

  return results;
});
