import { resourceName } from '../../constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'put',
  path: `/${resourceName}/reset-password`,
  summary: 'Reset password',
  description: 'Just reset users password',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {},
};

export default config;