import cron from 'scheduler/cron';

import logger from 'logger';

const schedule = {
  development: 'cron:every-minute',
  staging: 'cron:every-minute',
  production: 'cron:every-hour',
};

cron.on(schedule[process.env.APP_ENV], async () => {
  try {
  } catch (error) {
    logger.error(error);
  }
});
