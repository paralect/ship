import { AnyZodObject, z } from 'zod';
import { omit, capitalize } from 'lodash';
import { default as projectConfig } from 'config';
import { OpenAPIGenerator, OpenAPIRegistry, RouteConfig, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

const DEFAULT_CONFIG = {
  info: {
    title: 'My API',
    description: 'This is the my API for public',
    version: '1.0.0',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/license/mit/',
    },
  },
  servers: [
    {
      url: projectConfig.apiUrl,
      description: `${capitalize(projectConfig.env)} server`,
    },
  ],
};

let registry: OpenAPIRegistry;
const initClient = () => {
  extendZodWithOpenApi(z);
  registry = new OpenAPIRegistry();
};

type AuthType = 'bearerAuth' | 'cookieAuth';
export interface RouteExtendedConfig extends Omit<RouteConfig, 'security'> {
  private: boolean,
  authType?: AuthType
}
const registerDocs = (config: RouteExtendedConfig): void => {
  if (!registry) {
    throw Error('OpenAPIRegistry is not initialized');
  }

  const authStrategy: AuthType = config.authType || 'bearerAuth';
  if (config.private) {
    if (authStrategy === 'bearerAuth') {
      registry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      });
    }

    if (authStrategy === 'cookieAuth') {
      registry.registerComponent('securitySchemes', 'cookieAuth', {
        type: 'apiKey',
        in: 'cookie',
        name: 'JSESSIONID',
      });
    }
  }

  registry.registerPath({
    ...omit(config, 'private'),
    ...(config.private ? { security: [{ [authStrategy]: [] }] } : {}),
  });
};

const registerSchema = (name: string, schema: AnyZodObject): AnyZodObject => {
  if (!registry) {
    throw Error('OpenAPIRegistry is not initialized');
  }

  return registry.register(name, schema);
};

const getDocs = () => {
  if (!registry) {
    throw Error('OpenAPIRegistry is not initialized');
  }

  const generator = new OpenAPIGenerator(registry.definitions, '3.1.0');

  return generator.generateDocument(DEFAULT_CONFIG);
};

export default {
  initClient,
  registerDocs,
  registerSchema,
  getDocs,
};
