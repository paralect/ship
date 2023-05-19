import { ZodSchema } from 'zod';

const validateConfig = <T>(
  schema: ZodSchema,
  processEnv: Record<keyof T, string | undefined>,
): T => {
  const parsed = schema.safeParse(processEnv);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);

    throw new Error(`Invalid environment variables ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
  }

  return parsed.data;
};

export default {
  validateConfig,
};
