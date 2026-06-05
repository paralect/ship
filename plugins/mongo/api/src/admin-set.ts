import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import config from '@/config';
import { initDb } from '@ship/db';

import db from '@/db';
import logger from '@/logger';
import { emailSchema } from '@/resources/base.schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const usage = 'Usage: pnpm admin:set -- <email>';

const main = async () => {
  await initDb(config.MONGO_URI!, config.MONGO_DB_NAME!, path.join(__dirname, 'resources'));
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const rawEmail = args[0];

  if (!rawEmail || args.length > 1) {
    throw new Error(usage);
  }

  const email = emailSchema.parse(rawEmail);

  const user = await db.users.findOne({ email });

  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  if (user.isAdmin) {
    logger.info(`User ${email} is already an admin.`);
    return;
  }

  await db.users.updateOne({ _id: user._id }, () => ({ isAdmin: true }));

  logger.info(`User ${email} was promoted to admin.`);
};

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Failed to set admin access.';

    logger.error(message);
    process.exit(1);
  });
