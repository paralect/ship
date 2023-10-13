// allows to require modules relative to /src folder
// for example: require('lib/mongo/idGenerator')
// all options can be found here: https://gist.github.com/branneman/8048520
import moduleAlias from 'module-alias';
moduleAlias.addPath(__dirname);
moduleAlias(); // read aliases from package json

import 'dotenv/config';

import logger from 'logger';

import 'scheduler/cron';
import 'scheduler/handlers/action.example.handler';

logger.info('Scheduler has started');
