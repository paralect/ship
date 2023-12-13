import { z } from 'zod';

import { configUtil } from 'utils';

/**
 * Specify your environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const schema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  IS_DEV: z.preprocess(() => process.env.APP_ENV === 'development', z.boolean()),
  PORT: z.coerce.number().optional().default(3001),
  API_URL: z.string(),
  WEB_URL: z.string(),
  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),
  REDIS_URI: z.string().optional(),
  REDIS_ERRORS_POLICY: z.enum(['throw', 'log']).default('log'),
  SENDGRID_API_KEY: z.string().optional(),
  ADMIN_KEY: z.string().optional(),
  MIXPANEL_API_KEY: z.string().optional(),
  CLOUD_STORAGE_ENDPOINT: z.string().optional(),
  CLOUD_STORAGE_BUCKET: z.string().optional(),
  CLOUD_STORAGE_ACCESS_KEY_ID: z.string().optional(),
  CLOUD_STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

type Config = z.infer<typeof schema>;

const config = configUtil.validateConfig<Config>(schema);

export default config;
