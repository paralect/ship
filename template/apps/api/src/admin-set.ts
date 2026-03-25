import { eq } from 'drizzle-orm';
import process from 'node:process';

import { db, users } from '@/db';
import logger from '@/logger';
import { emailSchema } from '@/resources/base.schema';

const usage = 'Usage: pnpm admin:set -- <email>';

const main = async () => {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const rawEmail = args[0];

  if (!rawEmail || args.length > 1) {
    throw new Error(usage);
  }

  const email = emailSchema.parse(rawEmail);

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  if (user.isAdmin) {
    logger.info(`User ${email} is already an admin.`);
    return;
  }

  await db.update(users).set({ isAdmin: true }).where(eq(users.id, user.id));

  logger.info(`User ${email} was promoted to admin.`);
};

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Failed to set admin access.';

    logger.error(message);
    process.exit(1);
  });
