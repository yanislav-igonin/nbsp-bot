import pino from 'pino';

import { app } from '../config';

const createLogger = () => {
  const logLevel = () => {
    if (app.env === 'development') return 'debug';

    return 'info';
  };

  return pino({
    level: logLevel(),
    prettyPrint: true,
  });
};

const logger = createLogger();

export default logger;
