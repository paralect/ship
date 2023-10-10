import { z } from 'zod';

const schema = z.object({
  _id: z.string(),
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
  startTime: z.number(),
  finishTime: z.number().optional(),
  status: z.string(),
  error: z.string().optional(),
  errorStack: z.string().optional(),
  duration: z.string().optional(),
  migrationVersion: z.number(),
});

export default schema;
