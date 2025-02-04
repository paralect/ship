import { User } from 'database';
import mixpanel from 'mixpanel-browser';

import config from 'config';

export const init = () => {
  mixpanel.init(config.MIXPANEL_API_KEY ?? '', { debug: config.IS_DEV });
};

export const setUser = (user: User) => {
  mixpanel.identify(user?.id.toString());

  if (user) {
    mixpanel.people.set({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
};

export const track = (event: string, data = {}) => {
  try {
    mixpanel.track(event, data);
  } catch (e) {
    console.error(e);
  }
};
