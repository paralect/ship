import { resourceName } from '../../constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: true,
  tags: [resourceName],
  method: 'put',
  path: `/${resourceName}/`,
  summary: 'Update user profile',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {},
};

export default config;