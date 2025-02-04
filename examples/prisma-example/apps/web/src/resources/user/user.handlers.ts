import { User } from 'database';

import { apiService, socketService } from 'services';

import queryClient from 'query-client';

apiService.on('error', (error) => {
  if (error.status === 401) {
    queryClient.setQueryData<User | null>(['account'], null);
  }
});

socketService.on('connect', () => {
  const account = queryClient.getQueryData<User | null>(['account']);

  if (account) socketService.emit('subscribe', `user-${account.id}`);
});

socketService.on('user:updated', (user) => {
  const updatedUser = {
    ...user,
    createdAt: user.createdAt ?? new Date(),
    updatedAt: user.updatedAt ?? new Date(),
    passwordHash: user.passwordHash ?? null,
    isShadow: user.isShadow ?? null,
    signupToken: user.signupToken ?? null,
    resetPasswordToken: user.resetPasswordToken ?? null,
    avatarUrl: user.avatarUrl ?? null,
    lastRequest: user.lastRequest ?? new Date(),
  };
  queryClient.setQueryData<User | null>(['account'], updatedUser);
});
