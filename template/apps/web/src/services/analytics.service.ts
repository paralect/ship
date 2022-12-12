import environmentConfig from 'config';
import mixpanel from 'mixpanel-browser';
import { User } from 'resources/user/user.types';

const init = () => {
  mixpanel.init(environmentConfig.mixpanel.apiKey, { debug: process.env.NEXT_PUBLIC_APP_ENV === 'development' });
};

const setUser = (user: User | undefined) => {
  mixpanel.identify(user?._id);

  if (user) {
    mixpanel.people.set({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
};

const track = (event: string, data = {}) => {
  mixpanel.track(event, data);
};

export default {
  init,
  setUser,
  track,
};
