import { z } from 'zod';

import { validateConfig } from '@/utils/config.util';

const schema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  IS_DEV: z.preprocess(() => import.meta.env.VITE_APP_ENV === 'development', z.boolean()),
  API_URL: z.string(),
  WS_URL: z.string(),
  WEB_URL: z.string(),
  MIXPANEL_API_KEY: z.string().optional(),
});

type Config = z.infer<typeof schema>;

const processEnv = {
  APP_ENV: import.meta.env.VITE_APP_ENV,
  API_URL: import.meta.env.VITE_API_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
  WEB_URL: import.meta.env.VITE_WEB_URL,
  MIXPANEL_API_KEY: import.meta.env.VITE_MIXPANEL_API_KEY,
} as Record<keyof Config, string | undefined>;

const config = validateConfig<Config>(schema, processEnv);

export default config;
