import { z } from 'zod';

export const dbSchema = z.object({
  _id: z.string(),

  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  perPage: z.coerce.number().default(10),

  searchValue: z.string().optional(),

  sort: z
    .object({
      createdOn: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({ createdOn: 'asc' }),
});

export const listResultSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    results: z.array(itemSchema),
    pagesCount: z.number(),
    count: z.number(),
  });

export const emailSchema = z
  .email()
  .min(1, 'Email is required')
  .toLowerCase()
  .trim()
  .max(255, 'Email must be less than 255 characters.');

const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REGEX: /^(?=.*[a-z])(?=.*\d).+$/i,
};

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(PASSWORD_RULES.MIN_LENGTH, `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters.`)
  .max(PASSWORD_RULES.MAX_LENGTH, `Password must be less than ${PASSWORD_RULES.MAX_LENGTH} characters.`)
  .regex(
    PASSWORD_RULES.REGEX,
    `The password must contain ${PASSWORD_RULES.MIN_LENGTH} or more characters with at least one letter (a-z) and one number (0-9).`,
  );
