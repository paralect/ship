import winston from 'winston';
import config from 'config';

const getFormat = (isDev: boolean) => {
  if (isDev) {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple(),
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

export default createConsoleLogger(config.isDev);
