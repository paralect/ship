import environmentConfig from 'config';
import mixpanel from 'mixpanel-browser';
import { User } from 'resources/user/user.types';

export const init = () => {
  mixpanel.init(environmentConfig.mixpanel.apiKey, { debug: process.env.NEXT_PUBLIC_APP_ENV === 'development' });
};

export const setUser = (user: User | undefined) => {
  mixpanel.identify(user?._id);

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
    console.error(e); //eslint-disable-line
  }
};
