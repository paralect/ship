import schedule from 'node-schedule';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

schedule.scheduleJob('* * * * *', () => {
  eventEmitter.emit('cron:every-minute');
});

schedule.scheduleJob('0 * * * *', () => {
  eventEmitter.emit('cron:every-hour');
});

export default eventEmitter;
