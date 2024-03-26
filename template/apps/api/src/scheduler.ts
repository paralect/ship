// allows to require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
import logger from 'logger';
import moduleAlias from 'module-alias'; // read aliases from package json

import 'dotenv/config';
import 'scheduler/cron';
import 'scheduler/handlers/action.example.handler';

moduleAlias.addPath(__dirname);
moduleAlias();

logger.info('[Scheduler] Server has been started');
