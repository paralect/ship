import type { Logger } from 'winston';

declare global {
  /* eslint-disable vars-on-top */
  var logger: Logger;
}
