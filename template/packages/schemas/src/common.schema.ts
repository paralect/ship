import type { File as FormidableFile } from 'formidable';
import { z } from 'zod';

import { EMAIL_REGEX, ONE_MB_IN_BYTES, PASSWORD_REGEX } from 'app-constants';

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
