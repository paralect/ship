import { z } from 'zod';

import { validateConfig } from '../utils';

/**
 * Specify your environment variables schema here.
 * This way you can ensure the app isn't deployed with invalid env vars.
 */
const schema = z.object({
  GITHUB_REPOSITORY: z.string(),
  GITHUB_BRANCH: z.string(),
  PROJECT_NAME: z.string().default(process.env.PULUMI_NODEJS_PROJECT || ''),
  REGION: z.string().default('fra1'),

  APP_ENV: z.enum(['staging', 'production']),
  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string().optional(),
  REDIS_URI: z.string(),
  API_URL: z.string(),
  WEB_URL: z.string(),
  JWT_SECRET: z.string(),

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

const config = validateConfig<Config>(schema);

export default config;
