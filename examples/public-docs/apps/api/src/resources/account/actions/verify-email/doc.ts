import { resourceName } from 'resources/account/constants';
import { RouteExtendedConfig } from 'services/docs.service';

import { schema } from './schema';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/verify-email`,
  summary: 'Verify email',
  request: {
    query: schema,
  },
  responses: {
    302: {
      description: 'Redirect to web app',
    },
  },
};

export default config;
