export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export type RepoInfo = {
  username: string;
  name: string;
  branch: string;
};

export enum Deployment {
  DIGITAL_OCEAN_APPS = 'Digital Ocean Apps',
  RENDER = 'Render',
  DIGITAL_OCEAN_KUBERNETES = 'Digital Ocean Managed Kubernetes',
  AWS_KUBERNETES = 'AWS EKS',
}

export type Backend = 'postgres' | 'none';

/** Plugins that can be opted into at scaffold time. `requiresBackend` filters
 *  the list when the user picks the web-only flow. */
export interface PluginChoice {
  name: string;
  description: string;
  requiresBackend: boolean;
}

export const AVAILABLE_PLUGINS: PluginChoice[] = [
  { name: 'mailer', description: 'Resend + React Email templates', requiresBackend: true },
  { name: 'cloud-storage', description: 'S3-compatible file upload (Garage dev / Wasabi prod)', requiresBackend: true },
  { name: 'auth-starter', description: 'better-auth wiring (requires mailer + cloud-storage)', requiresBackend: true },
  { name: 'admin', description: 'Admin dashboard with user list (requires auth-starter)', requiresBackend: true },
  { name: 'notes', description: 'Notes CRUD — example domain plugin', requiresBackend: true },
  { name: 'ai-chat', description: 'AI chat via @ship/ai (requires auth-starter)', requiresBackend: true },
];
