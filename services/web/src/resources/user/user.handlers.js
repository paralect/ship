import queryClient from 'query-client';
import { apiService, socketService } from 'services';

apiService.on('error', (error) => {
  if (error.status === 401) {
    queryClient.setQueryData(['currentUser'], null);
  }
});

socketService.on('connect', () => {
  const currentUser = queryClient.getQueryData(['currentUser']);

  socketService.emit('subscribe', `user-${currentUser._id}`);
});

socketService.on('user:updated', (data) => {
  queryClient.setQueryData(['currentUser'], data);
});
