import { z } from 'zod';

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  token: z.string(),
  email: z.string().email(),
  invitedBy: z.string(),
}).strict();

export default schema;
