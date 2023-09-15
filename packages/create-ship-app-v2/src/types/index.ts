export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export type RepoInfo = {
  username: string
  name: string
  branch: string
};

export enum Deployment {
  DIGITAL_OCEAN_APPS = 'Digital Ocean Apps',
  RENDER = 'Render',
  DIGITAL_OCEAN_KUBERNETES = 'Digital Ocean Managed Kubernetes',
  AWS_KUBERNETES = 'AWS EKS',
}
