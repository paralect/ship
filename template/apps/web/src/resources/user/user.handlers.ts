import queryClient from 'query-client';
import { apiService, socketService } from 'services';

import { User } from './user.types';

apiService.on('error', (error: any) => {
  if (error.status === 401) {
    queryClient.setQueryData(['currentUser'], null);
  }
});

socketService.on('connect', () => {
  const currentUser = queryClient.getQueryData(['currentUser']) as User;

  socketService.emit('subscribe', `user-${currentUser._id}`);
});

socketService.on('user:updated', (data: User) => {
  queryClient.setQueryData(['currentUser'], data);
});
