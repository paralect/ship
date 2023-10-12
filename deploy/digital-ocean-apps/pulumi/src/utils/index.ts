import { z, ZodSchema } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as process from 'process';

const pulumiStack = process.env.PULUMI_NODEJS_STACK;

dotenv.config({ path: path.resolve(process.cwd(), `.env.${pulumiStack}`) });

const pulumiStackSchema = z.enum(['staging', 'production']);

export const validateConfig = <T>(schema: ZodSchema): T => {
  const parsedPulumiStackValue = pulumiStackSchema.safeParse(pulumiStack);

  if (!parsedPulumiStackValue.success) {
    console.error(`❌  Invalid pulumi stack name: Expected 'staging' | 'production', received '${pulumiStack}'`);
    console.error('💡 Remove current stack via the following command:');
    console.error(`     pulumi stack rm ${pulumiStack}`);

    process.exit(1);
  }

  process.env.APP_ENV = pulumiStack;

  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌  Invalid environment variables:', parsed.error.flatten().fieldErrors);

    process.exit(1);
  }

  return parsed.data;
};
