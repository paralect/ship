import { ZodSchema } from 'zod';

const validateConfig = <T>(schema: ZodSchema): T => {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    // Allow the use of a console instance for logging before launching the application.
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);

    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export default {
  validateConfig,
};
