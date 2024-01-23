import { Job } from 'agenda';

import { ScheduleActionData } from '../types';
import agenda from '../agenda';

agenda.define<ScheduleActionData>('schedule-action', async (job: Job) => {
  const { isExample } = job.attrs.data;

  if (!isExample) {
    job.fail('The isExample param wasn\'t provided');
  }

  job.remove();
});

export const scheduleAction = async (options: ScheduleActionData) =>
  agenda.schedule(options.createOn, 'schedule-action', options);
