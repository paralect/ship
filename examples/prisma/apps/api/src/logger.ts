import _ from 'lodash';
import winston from 'winston';

import config from 'config';

const formatToPrettyJson = winston.format.printf(({ level, message }) => {
  if (_.isPlainObject(message)) {
    message = JSON.stringify(message, null, 4);
  }

  return `${level}: ${message}`;
});

const getFormat = (isDev: boolean) => {
  if (isDev) {
    return winston.format.combine(
      winston.format.colorize({
        colors: {
          http: 'cyan',
        },
      }),
      winston.format.splat(),
      winston.format.simple(),
      formatToPrettyJson,
    );
  }

  return winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.json(),
  );
};

const createConsoleLogger = (isDev = false) => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      level: isDev ? 'debug' : 'verbose',
    }),
  ];

  return winston.createLogger({
    exitOnError: false,
    transports,
    format: getFormat(isDev),
  });
};

const consoleLogger = createConsoleLogger(config?.IS_DEV ?? process.env.APP_ENV === 'development');

global.logger = consoleLogger;

export default consoleLogger;
