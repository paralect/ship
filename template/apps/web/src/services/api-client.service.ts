import { ApiClient, createApiEndpoints } from 'shared';

import config from 'config';

const client = new ApiClient({
  baseURL: config.API_URL,
  withCredentials: true,
});

export const apiClient = createApiEndpoints(client);

// Also export the raw client for event handling
export { client as apiClientRaw };
