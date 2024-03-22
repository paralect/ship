import cron from 'scheduler/cron';

import logger from 'logger';
import config from 'config';

const schedule = {
  development: 'cron:every-minute',
  staging: 'cron:every-minute',
  production: 'cron:every-hour',
};

cron.on(schedule[config.APP_ENV], async () => {
  try {
  } catch (error) {
    logger.error(error);
  }
});
