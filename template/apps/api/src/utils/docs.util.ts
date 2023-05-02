import { z } from 'zod';
import { omit } from 'lodash';
import { default as projectConfig } from 'config';
import { OpenAPIGenerator, OpenAPIRegistry, RouteConfig, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

let registry: OpenAPIRegistry;
const initClient = () => {
  extendZodWithOpenApi(z);
  registry = new OpenAPIRegistry();
};

interface RouteExtendedConfig extends Omit<RouteConfig, 'security'> {
  private: boolean,
}
const registerDocs = (config: RouteExtendedConfig): void => {
  if (!projectConfig.docs) {
    return;
  }

  if (!registry) {
    throw Error('OpenAPIRegistry is not initialized');
  }

  let bearerAuth;
  if (config.private) {
    bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    });
  }

  registry.registerPath({
    ...omit(config, 'private'),
    ...(bearerAuth ? { security: [{ [bearerAuth.name]: [] }] } : {}),
  });
};

const getDocs = () => {
  if (!projectConfig.docs) {
    return {};
  }

  if (!registry) {
    throw Error('OpenAPIRegistry is not initialized');
  }

  const generator = new OpenAPIGenerator(registry.definitions, '3.1.0');

  return generator.generateDocument(projectConfig.docs as any);
};

export default {
  initClient,
  registerDocs,
  getDocs,
};
