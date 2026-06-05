import mixpanel from 'mixpanel-browser';

import config from 'config';

import { User } from '@/services/api-client.service';

export const init = () => {
  mixpanel.init(config.MIXPANEL_API_KEY ?? '', { debug: config.IS_DEV });
};

export const setUser = (user: User | undefined) => {
  mixpanel.identify(user?.id);

  if (user) {
    mixpanel.people.set({
      name: user.fullName,
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
