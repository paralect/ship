import { defineConfig } from 'drizzle-kit';
import process from 'node:process';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/resources/*/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
