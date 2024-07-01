import { EventEmitter } from 'events';
import schedule from 'node-schedule';

const eventEmitter = new EventEmitter();

schedule.scheduleJob('* * * * *', () => {
  eventEmitter.emit('cron:every-minute');
});

schedule.scheduleJob('0 * * * *', () => {
  eventEmitter.emit('cron:every-hour');
});

export default eventEmitter;
