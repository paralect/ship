import Mixpanel from 'mixpanel';

import config from 'config';

const mixpanel = config.MIXPANEL_API_KEY ? Mixpanel.init(config.MIXPANEL_API_KEY) : null;

const track = (event: string, data = {}) => {
  if (config.MIXPANEL_API_KEY) {
    mixpanel?.track(event, data);
  }
};

export default {
  track,
};
