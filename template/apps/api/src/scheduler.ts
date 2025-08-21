/* eslint-disable simple-import-sort/imports */

import 'dotenv/config';

import logger from 'logger';

import 'scheduler/cron';
import 'scheduler/handlers/action.example.handler';

logger.info('[Scheduler] Server has been started');
