const schedule = require('node-schedule');
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

schedule.scheduleJob('* * * * *', () => {
  eventEmitter.emit('cron:every-minute');
});

module.exports = eventEmitter;
