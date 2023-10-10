import Mixpanel from 'mixpanel';

import config from 'config';

const mixpanel = config.mixpanel.apiKey ? Mixpanel.init(config.mixpanel.apiKey) : null;

const track = (event: string, data = {}) => {
  if (config.mixpanel.apiKey) {mixpanel?.track(event, data);}
};

export default {
  track,
};
