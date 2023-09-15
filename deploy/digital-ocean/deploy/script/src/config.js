const path = require('path');
const rootDir = path.resolve(__dirname, './../../../');

const ENV = process.env;

const config = {
  rootDir,
  
  service: ENV.SERVICE,
  
  environment: ENV.ENVIRONMENT || 'staging',
  
  namespace: ENV.NAMESPACE || 'staging',
  
  kubeConfig: ENV.KUBE_CONFIG,
  
  home: ENV.HOME,
  
  nodePool: 'pool-app',
  
  dockerRegistry: {
    name: 'registry.digitalocean.com/paralect/ship',
    username: ENV.DOCKER_AUTH_USERNAME,
    password: ENV.DOCKER_AUTH_PASSWORD,
    
    imageTag: ENV.IMAGE_TAG,
  },
};

const deployConfig =  {
  api: {
    dockerRepo: `${config.dockerRegistry.name}-api`,
    dockerContextDir: rootDir,
    folder: 'api',
    dockerFilePath: `${rootDir}/apps/api/Dockerfile`,
  },
  web: {
    dockerRepo: `${config.dockerRegistry.name}-web`,
    dockerContextDir: rootDir,
    folder: 'web',
    dockerFilePath: `${rootDir}/apps/web/Dockerfile`,
  },
  scheduler: {
    dockerRepo: `${config.dockerRegistry.name}-scheduler`,
    dockerContextDir: rootDir,
    folder: 'scheduler',
    dockerFilePath: `${rootDir}/apps/api/Dockerfile.scheduler`,
  },
  migrator: {
    dockerRepo: `${config.dockerRegistry.name}-migrator`,
    dockerContextDir: rootDir,
    dockerFilePath: `${rootDir}/apps/api/Dockerfile.migrator`,
  }
};

config.deploy = deployConfig;

module.exports = config;
