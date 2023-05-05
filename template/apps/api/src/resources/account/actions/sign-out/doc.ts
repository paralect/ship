import { resourceName } from '../../constants';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/sign-out`,
  summary: 'Sign out',
  request: {},
  responses: {
    200: {
      description: 'Removed all auth metadata.',
    },
  },
};

export default config;