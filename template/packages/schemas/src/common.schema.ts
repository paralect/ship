import type { File as FormidableFile } from 'formidable';
import { z } from 'zod';

import { ONE_MB_IN_BYTES, PASSWORD_RULES } from 'app-constants';

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

export const emailSchema = z
  .string()
  .nonempty('Email is required')
  .toLowerCase()
  .trim()
  .email()
  .max(255, 'Email must be less than 255 characters.');

export const passwordSchema = z
  .string()
  .nonempty('Password is required')
  .min(PASSWORD_RULES.MIN_LENGTH, `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters.`)
  .max(PASSWORD_RULES.MAX_LENGTH, `Password must be less than ${PASSWORD_RULES.MAX_LENGTH} characters.`)
  .regex(
    PASSWORD_RULES.REGEX,
    `The password must contain ${PASSWORD_RULES.MIN_LENGTH} or more characters with at least one letter (a-z) and one number (0-9).`,
  );

export const fileSchema = (fileSize: number, acceptedFileTypes: string[]) =>
  z
    .union([z.custom<File>(), z.custom<FormidableFile>()])
    .refine((file) => !!file, 'File is required.')
    .refine((file) => file.size <= fileSize, `Max file size is ${Math.round(fileSize / ONE_MB_IN_BYTES)}MB.`)
    .refine(
      (file) => {
        if (file) {
          const mimetype = 'mimetype' in file ? file.mimetype : file?.type;

          return acceptedFileTypes.includes(mimetype as string);
        }

        return false;
      },
      `Only ${acceptedFileTypes.map((fileType) => `.${fileType.split('/')[1]}`).join(', ')} file formats are allowed.`,
    );
