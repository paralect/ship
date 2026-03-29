import { currentUserKey } from 'hooks';

import * as socketService from 'services/socket.service';

import queryClient from 'query-client';

import type { User } from 'types';

socketService.on('connect', () => {
  const currentUser = queryClient.getQueryData<User | null>(currentUserKey);

  if (currentUser) {
    socketService.emit('subscribe', `user-${currentUser._id}`);
  }
});
