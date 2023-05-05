import { resourceName } from '../../constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/resend-email`,
  summary: 'Resend email',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {},
};

export default config;