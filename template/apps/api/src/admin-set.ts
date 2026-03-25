import process from 'node:process';

import db from '@/db';
import logger from '@/logger';
import { emailSchema } from '@/resources/users/users.schema';

const usage = 'Usage: pnpm admin:set -- <email>';

const main = async () => {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const rawEmail = args[0];

  if (!rawEmail || args.length > 1) {
    throw new Error(usage);
  }

  const email = emailSchema.parse(rawEmail);

  const user = await db.users.findFirst({ where: { email } });

  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  if (user.isAdmin) {
    logger.info(`User ${email} is already an admin.`);
    return;
  }

  await db.users.updateOne({ id: user.id }, { isAdmin: true });

  logger.info(`User ${email} was promoted to admin.`);
};

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Failed to set admin access.';

    logger.error(message);
    process.exit(1);
  });
