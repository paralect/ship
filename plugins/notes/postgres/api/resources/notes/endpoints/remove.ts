import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import shouldOwnNote from '@/resources/notes/middlewares/should-own-note';
import { z } from 'zod';

const inputSchema = z.object({
  id: z.string(),
});

export default endpoint
  .use(isAuthorized)
  .route({ method: 'DELETE', path: '/notes/{id}' })
  .input(inputSchema)
  .use(shouldOwnNote)
  .output(z.void())
  .handler(async ({ input }) => {
  await db.notes.deleteOne({ id: input.id });
});
