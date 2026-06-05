import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import canEditNote from '@/resources/notes/middlewares/can-edit-note';
import { z } from 'zod';

const inputSchema = z.object({
  id: z.string(),
});

export default endpoint
  .use(isAuthorized)
  .route({ method: 'DELETE', path: '/notes/{id}' })
  .input(inputSchema)
  .use(canEditNote)
  .handler(async ({ input }) => {
  await db.notes.deleteOne({ _id: input.id });
});
