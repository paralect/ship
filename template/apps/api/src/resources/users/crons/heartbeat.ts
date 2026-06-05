import logger from '@/logger';
import scheduler from '@/scheduler';

export default scheduler({
  cron: '0 * * * *',
  handler: async () => {
    logger.info('[Scheduler] heartbeat');
  },
});
