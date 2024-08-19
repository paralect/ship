import { z } from 'zod';

import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),

  searchValue: z.string().optional(),

  sort: z
    .object({
      createdOn: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({}),
});

export const emailSchema = z.string().toLowerCase().regex(EMAIL_REGEX, 'Email format is incorrect.');
export const passwordSchema = z
  .string()
  .regex(
    PASSWORD_REGEX,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  );
