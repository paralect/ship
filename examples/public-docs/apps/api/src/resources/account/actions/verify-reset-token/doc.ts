import { resourceName } from 'resources/account/constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/verify-reset-token`,
  summary: 'Verify reset token',
  description: 'Check reset token',
  request: {
    query: schema,
  },
  responses: {
    302: {
      description: 'Redirect to reset password page',
    },
  },
};

export default config;