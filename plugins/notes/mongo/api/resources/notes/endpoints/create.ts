import db from '@/db';
import endpoint from '@/endpoint';
import isAuthorized from '@/middlewares/is-authorized';
import { z } from 'zod';

const inputSchema = z.object({
  text: z.string().min(1).max(1000),
});

export default endpoint
  .use(isAuthorized)
  .route({ method: 'POST', path: '/notes' })
  .input(inputSchema)
  .handler(async ({ context, input }) => {
  return db.notes.insertOne({
    userId: context.user._id,
    text: input.text,
  });
});