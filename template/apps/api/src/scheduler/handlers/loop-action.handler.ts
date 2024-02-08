import { Job } from 'agenda';

import config from 'config';

import { ExampleActionData } from '../types';
import agenda from '../agenda';

const every = {
  development: '1 minute',
  staging: '1 minute',
  production: '1 hour',
};

agenda.define<ExampleActionData>('loop-action', async (job: Job, done: () => void) => {
  const { isExample } = job.attrs.data;

  if (!isExample) {
    job.fail('The isExample param wasn\'t provided');
  }

  done();
});

agenda.every(every[config.APP_ENV], 'loop-action', { isExample: true });
