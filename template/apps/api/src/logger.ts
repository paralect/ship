import winston from 'winston';

import config from 'config';

const formatToPrettyJson = winston.format.printf(info => {
  if (typeof info.message.constructor === 'object' || typeof info.message.constructor === 'function') {
    info.message = JSON.stringify(info.message, null, 4);
  }

  return `${info.level}: ${info.message}`;
});

const getFormat = (isDev: boolean) => {
  if (isDev) {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple(),
      formatToPrettyJson,
    );
  }

  return winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  );
};

const createConsoleLogger = (isDev: boolean) => {
  const transports: any[] = [
    new winston.transports.Console({
      level: isDev ? 'debug' : 'info',
      stderrLevels: [
        'emerg',
        'alert',
        'crit',
        'error',
      ],
    }),
  ];

  const logger = winston.createLogger({
    exitOnError: false,
    transports,
    format: getFormat(isDev),
  });

  logger.debug('[logger] Configured console based logger');

  return logger;
};

const consoleLogger = createConsoleLogger(config.IS_DEV);

global.logger = consoleLogger;

export default consoleLogger;
