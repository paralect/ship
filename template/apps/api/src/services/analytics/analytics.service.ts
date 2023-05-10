import Mixpanel from 'mixpanel';

import config from 'config';
import logger from 'logger';

const mixpanel = config.mixpanel.apiKey
  ? Mixpanel.init(config.mixpanel.apiKey, { debug: config.isDev })
  : null;

const track = (event: string, data = {}) => {
  if (!mixpanel) {
    logger.error('The analytics service was not initialized');
    return;
  }

  try {
    mixpanel.track(event, data);
  } catch (e) {
    logger.error(e);
  }
};

export default {
  track,
};
