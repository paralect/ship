import { resourceName } from '../../constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/verify-email`,
  summary: 'Verify email',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {
    302: {
      description: 'Redirect to web app',
    },
  },
};

export default config;