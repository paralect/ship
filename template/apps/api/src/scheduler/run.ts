import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import schedule from 'node-schedule';

import logger from '@/logger';
import { registeredJobs } from '@/scheduler';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESOURCES_DIR = join(__dirname, '..', 'resources');

async function loadCrons() {
  if (!existsSync(RESOURCES_DIR)) {
    return;
  }

  for (const resource of readdirSync(RESOURCES_DIR, { withFileTypes: true })) {
    if (!resource.isDirectory()) {
      continue;
    }

    const cronsDir = join(RESOURCES_DIR, resource.name, 'crons');
    if (!existsSync(cronsDir)) {
      continue;
    }

    for (const file of readdirSync(cronsDir)) {
      if (!/\.[jt]s$/.test(file) || file.endsWith('.d.ts')) {
        continue;
      }
      await import(pathToFileURL(join(cronsDir, file)).href);
    }
  }
}

async function main() {
  await loadCrons();

  const jobs = registeredJobs();

  for (const { cron, handler } of jobs) {
    schedule.scheduleJob(cron, async () => {
      try {
        await handler();
      } catch (error) {
        logger.error(error);
      }
    });
  }

  logger.info(`[Scheduler] Started with ${jobs.length} cron job(s)`);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
