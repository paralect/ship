import { queryKey } from 'hooks';

import { apiClient } from 'services/api-client.service';
import * as socketService from 'services/socket.service';

import queryClient from 'query-client';

import type { User } from 'types';

const accountKey = queryKey(apiClient.users.getCurrent);

socketService.on('connect', () => {
  const account = queryClient.getQueryData<User | null>(accountKey);

  if (account) {
    socketService.emit('subscribe', `user-${account._id}`);
  }
});

socketService.on('user:updated', (user: User) => {
  queryClient.setQueryData<User | null>(accountKey, user);
});
