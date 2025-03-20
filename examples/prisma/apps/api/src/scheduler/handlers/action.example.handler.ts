import cron from 'scheduler/cron';

import config from 'config';

import logger from 'logger';

const schedule = {
  development: 'cron:every-minute',
  staging: 'cron:every-minute',
  production: 'cron:every-hour',
};

cron.on(schedule[config.APP_ENV], async () => {
  try {
    // Scheduler logic
  } catch (error) {
    logger.error(error);
  }
});
