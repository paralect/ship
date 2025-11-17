import { z, ZodType } from 'zod';

export const validateConfig = <T>(schema: ZodType, processEnv: Record<keyof T, string | undefined>): T => {
  const parsed = schema.safeParse(processEnv);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables ❌');
    console.error(z.prettifyError(parsed.error));

    throw new Error('Invalid environment variables');
  }

  return parsed.data as T;
};
