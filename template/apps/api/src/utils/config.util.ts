import process from 'node:process';
import { z, ZodType } from 'zod';

const validateConfig = <T>(schema: ZodType<T>): T => {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables ❌');
    console.error(z.prettifyError(parsed.error));

    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export default {
  validateConfig,
};
