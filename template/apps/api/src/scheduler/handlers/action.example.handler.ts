import cron from 'scheduler/cron';

const schedule = {
  development: 'cron:every-minute',
  'development-docker': 'cron:every-minute',
  staging: 'cron:every-minute',
  production: 'cron:every-hour',
};

cron.on(schedule[process.env.APP_ENV], async () => {
  try {
  } catch (error) {
    console.error(error);
  }
});
