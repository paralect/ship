import { resourceName } from '../../constants';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: true,
  tags: [resourceName],
  method: 'get',
  path: `/${resourceName}/`,
  summary: 'Get current user',
  request: {},
  responses: {},
};

export default config;