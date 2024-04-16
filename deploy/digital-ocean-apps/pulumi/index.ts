import * as digitalocean from '@pulumi/digitalocean';

import config from './src/config';

import { API_NAME, SCHEDULER_NAME, MIGRATOR_NAME, WEB_NAME } from './app.constants';

const githubConfig = {
  branch: config.GITHUB_BRANCH,
  repo: config.GITHUB_REPOSITORY,
};

export const apiApp = new digitalocean.App(API_NAME, {
  spec: {
    name: API_NAME,
    region: config.REGION,
    domainNames: [{ name: config.API_URL }],
    envs: [
      {
        key: 'APP_ENV',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'GENERAL',
        value: config.APP_ENV,
      },
      {
        key: 'MONGO_URI',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'SECRET',
        value: config.MONGO_URI,
      },
      {
        key: 'MONGO_DB_NAME',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'GENERAL',
        value: config.MONGO_DB_NAME || `api-${config.APP_ENV}`,
      },
      {
        key: 'REDIS_URI',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'SECRET',
        value: config.REDIS_URI,
      },
      {
        key: 'API_URL',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'GENERAL',
        value: `https://${config.API_URL}`,
      },
      {
        key: 'WEB_URL',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'GENERAL',
        value: `https://${config.WEB_URL}`,
      },
      {
        key: 'JWT_SECRET',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'GENERAL',
        value: config.JWT_SECRET,
      },
    ],
    services: [{
      name: API_NAME,
      instanceCount: 1,
      instanceSizeSlug: 'basic-xxs',
      github: githubConfig,
      httpPort: 3001,
      dockerfilePath: './apps/api/Dockerfile',
      sourceDir: '.',
    }],
    workers: [{
      name: SCHEDULER_NAME,
      instanceCount: 1,
      instanceSizeSlug: 'basic-xxs',
      github: githubConfig,
      dockerfilePath: './apps/api/Dockerfile.scheduler',
      sourceDir: '.',
    }],
    jobs: [{
      name: MIGRATOR_NAME,
      kind: 'PRE_DEPLOY',
      instanceCount: 1,
      instanceSizeSlug: 'basic-xxs',
      github: githubConfig,
      dockerfilePath: './apps/api/Dockerfile.migrator',
      sourceDir: '.',
    }],
  },
});

export const webApp = new digitalocean.App(WEB_NAME, {
  spec: {
    name: WEB_NAME,
    region: config.REGION,
    domainNames: [{ name: config.WEB_URL }],
    envs: [
      {
        key: 'APP_ENV',
        scope: 'RUN_AND_BUILD_TIME',
        type: 'GENERAL',
        value: config.APP_ENV,
      },
    ],
    services: [{
      name: WEB_NAME,
      instanceCount: 1,
      instanceSizeSlug: 'basic-xxs',
      httpPort: 3002,
      github: githubConfig,
      dockerfilePath: './apps/web/Dockerfile',
      sourceDir: '.',
    }],
  },
});

export const spacesBucket = new digitalocean.SpacesBucket(config.PROJECT_NAME, {
  name: config.PROJECT_NAME,
  region: config.REGION,
});

export const project = new digitalocean.Project(config.PROJECT_NAME, {
  name: config.PROJECT_NAME,
  description: 'A project based on Ship (ship.paralect.com)',
  purpose: 'Web Application',
  resources: [
    apiApp.appUrn,
    webApp.appUrn,
    spacesBucket.bucketUrn,
  ],
});
