import { currentUserKey } from '@/hooks/use-current-user.hook';

import * as socketService from '@/services/socket.service';

import queryClient from '@/query-client';

import type { User } from '@/services/api-client.service';

socketService.on('connect', () => {
  const currentUser = queryClient.getQueryData<User | null>(currentUserKey);

  if (currentUser) {
    socketService.emit('subscribe', `user-${currentUser.id}`);
  }
});
