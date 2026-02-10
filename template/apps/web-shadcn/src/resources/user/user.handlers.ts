import { apiService, socketService } from 'services';

import queryClient from 'query-client';

import { User } from 'types';

apiService.on('error', (error) => {
  if (error.status === 401) {
    queryClient.setQueryData<User | null>(['account'], null);
  }
});

socketService.on('connect', () => {
  const account = queryClient.getQueryData<User | null>(['account']);

  if (account) socketService.emit('subscribe', `user-${account._id}`);
});

socketService.on('user:updated', (user) => {
  queryClient.setQueryData<User | null>(['account'], user);
});
