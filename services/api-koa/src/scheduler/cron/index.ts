import schedule from 'node-schedule';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

schedule.scheduleJob('* * * * *', () => {
  eventEmitter.emit('cron:every-minute');
});

export default eventEmitter;
