import api from 'services/api.service';
import * as socketService from 'services/socket.service';

import store from 'resources/store';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';

api.on('error', (error) => {
  if (error.status === 401) {
    store.dispatch(userActions.signOut());
  }
});

socketService.on('connect', () => {
  const user = userSelectors.selectUser(store.getState());
  socketService.emit('subscribe', `user-${user._id}`);
});

socketService.on('user:updated', (user) => {
  store.dispatch(userActions.setUser({ user }));
});
