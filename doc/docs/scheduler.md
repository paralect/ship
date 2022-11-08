---
sidebar_position: 5
---

# Scheduler

Sometimes building web applications, you meet repetitive tasks that should be run at a specific time every day, month, or year.
Some of these tasks may include:

- Sending periodic emails to customers;
- Backing up the organization’s data;
- Clearing logs from databases;

Here is where **Scheduler** comes in. It allows you to schedule jobs (arbitrary functions) for execution at specific dates, with optional recurrence rules.
Scheduler service shares the same code base with **[API](docs/api/overview.md)** and located in the [`scheduler`](https://github.com/paralect/ship/tree/master/template/apps/api/src/scheduler) folder.  

It runs and deploys as a standalone service with its own Dockerfile. This workflow allows time-consuming tasks not to interfere with the server processing requests.

Scheduler consists of two parts: [Cron jobs](#cron-jobs) and [Handlers](#handlers).

## Cron jobs

```typescript
import schedule from 'node-schedule';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

schedule.scheduleJob('* * * * *', () => {
  eventEmitter.emit('cron:every-hour');
});

export default eventEmitter;
```

The cron jobs part is responsible for waiting some moment and emitting more specific events. It uses a [node-schedule](https://www.npmjs.com/package/node-schedule) library. In short, you should create a cron job in the appropriate format and emit an event using [EventEmitter](https://nodejs.dev/en/learn/the-nodejs-event-emitter/) that will be handled in the [Handlers](#handlers) part forward.

**Cron format**

```markdown
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of the week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of the month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

## Handlers

```typescript
import cron from 'scheduler/cron';

cron.on('cron:every-hour', async () => {
  try {
    const users = await userService.find({
      'scheduledEmail.deliveryDate': { $lte: new Date() },
    });

    users.map((u) => emailService.sendSignupWelcome(u.email))
  } catch (err) {
    console.log(`cron:every-hour error: ${err}`);
  }
});
```

The handlers part is responsible for listening to events from Cron jobs and running some handlers. Wrap handlers with try/catch to prevent a server from stopping or rebooting and create error logs.
