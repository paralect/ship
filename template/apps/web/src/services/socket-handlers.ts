/**
 * Socket event handlers for real-time updates
 * This file sets up listeners for socket events and API errors
 */

import { AccountGetResponse } from 'shared';

import { apiClient, apiClientRaw } from 'services/api-client.service';
import * as socketService from 'services/socket.service';

import queryClient from 'query-client';

// Query key for account data (matches the path used in useApiQuery)
const ACCOUNT_QUERY_KEY = [apiClient.account.get.path];

// Handle 401 errors by clearing the account data
apiClientRaw.on('error', (error) => {
  if (error.status === 401) {
    queryClient.setQueryData<AccountGetResponse | null>(ACCOUNT_QUERY_KEY, null);
  }
});

// Subscribe to user-specific events when socket connects
socketService.on('connect', () => {
  const account = queryClient.getQueryData<AccountGetResponse | null>(ACCOUNT_QUERY_KEY);

  if (account) {
    socketService.emit('subscribe', `user-${account._id}`);
  }
});

// Handle real-time user updates
socketService.on('user:updated', (user: AccountGetResponse) => {
  queryClient.setQueryData<AccountGetResponse | null>(ACCOUNT_QUERY_KEY, user);
});
