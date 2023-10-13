import { z } from 'zod';

export default z.object({
  _id: z.string(),

  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
}).strict();
