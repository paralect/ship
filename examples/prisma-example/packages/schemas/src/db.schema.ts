import { z } from 'zod';

export default z
  .object({
    id: z.string(),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().optional().nullable(),
  })
  .strict();
