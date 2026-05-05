import process from 'node:process';
import { z } from 'zod';

import configUtil from '@/utils/config.util';

/**
 * Specify your environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const schema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  IS_DEV: z.preprocess(() => process.env.APP_ENV === 'development', z.boolean()),
  PORT: z.coerce.number().optional().default(3001),
  API_URL: z.string(),
  WEB_URL: z.string(),
  DATABASE_URL: z.string(),
  REDIS_URI: z.string().optional(),
  REDIS_ERRORS_POLICY: z.enum(['throw', 'log']).default('log'),
  RESEND_API_KEY: z.string().optional(),
  ADMIN_KEY: z.string().optional(),
  MIXPANEL_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
});

type Config = z.infer<typeof schema>;

const config = configUtil.validateConfig<Config>(schema);

export default config;
