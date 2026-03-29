import type { ORPCContext } from '@/types';

export interface ServerConfig {
  resolveUser: (ctx: ORPCContext) => Promise<void>;
  socketAuth: (cookie: string) => Promise<{ userId: string } | null>;
  authHandler?: (request: Request) => Promise<Response> | Response;
}

const serverConfig: ServerConfig = {
  resolveUser: async () => {},
  socketAuth: async () => null,
};

export default serverConfig;
