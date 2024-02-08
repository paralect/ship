import Agenda from 'agenda';

import config from 'config';

const agenda = new Agenda({
  db: {
    address: config.MONGO_URI,
    collection: 'agendaJobs',
  },
  processEvery: '1 minute',
  maxConcurrency: 20,
});

(async () => {
  await agenda.start(); 
})();

export default agenda;
