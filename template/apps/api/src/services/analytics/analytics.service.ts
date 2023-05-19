import Mixpanel from 'mixpanel';

import config from 'config';
import logger from 'logger';

const mixpanel = config.MIXPANEL_API_KEY
  ? Mixpanel.init(config.MIXPANEL_API_KEY, { debug: config.IS_DEV })
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
