const winston = require('winston');
const config = require('config');

const colorizer = winston.format.colorize();

const createConsoleLogger = () => {
  // eslint-disable-next-line new-cap
  const logger = new winston.createLogger({
    exitOnError: false,
    level: config.isDev ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      config.isDev
        ? winston.format.printf((msg) => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${JSON.stringify(msg.message)}`))
        : winston.format.json(),
    ),
    transports: [
      new winston.transports.Console(),
    ],
  });

  logger.debug('[logger] Configured console based logger');

  return logger;
};

module.exports = createConsoleLogger();
