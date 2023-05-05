import { resourceName } from '../../constants';
import { schema } from './schema';
import { RouteExtendedConfig } from 'services/docs.service';

const config: RouteExtendedConfig = {
  private: false,
  tags: [resourceName],
  method: 'post',
  path: `/${resourceName}/sign-up`,
  summary: 'Sign up',
  request: {
    body: { content: { 'application/json': { schema } } },
  },
  responses: {
    // 200: {
    //   description: 'Object with user data.',
    //   content: {
    //     'application/json': {
    //       schema: UserSchema,
    //     },
    //   },
    // },
    // 204: {
    //   description: 'No content - successful operation',
    // },
  },
};

export default config;