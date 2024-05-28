import { z } from 'zod';

const schema = z.object({
  _id: z.string(),

  version: z.number(),

  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
});

export default schema;
