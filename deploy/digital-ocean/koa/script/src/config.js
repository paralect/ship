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
    dir: `${rootDir}/api`,
    folder: 'api',
  },
  web: {
    dockerRepo: `${config.dockerRegistry.name}-web`,
    dir: `${rootDir}/web`,
    folder: 'web',
  },
  scheduler: {
    dockerRepo: `${config.dockerRegistry.name}-scheduler`,
    dir: `${rootDir}/api`,
    folder: 'scheduler',
    dockerFilePath: `${rootDir}/api/Dockerfile.scheduler`,
  },
  migrator: {
    dockerRepo: `${config.dockerRegistry.name}-migrator`,
    dir: `${rootDir}/api`,
    dockerFilePath: `${rootDir}/api/Dockerfile.migrator`,
  }
};

Object.keys(deployConfig).forEach(serviceName => {
  if (!deployConfig[serviceName].dockerFilePath) {
    deployConfig[serviceName].dockerFilePath = `${deployConfig[serviceName].dir}/Dockerfile`;
  }
  
  if (!deployConfig[serviceName].dockerContextDir) {
    deployConfig[serviceName].dockerContextDir = deployConfig[serviceName].dir;
  }
});

config.deploy = deployConfig;

module.exports = config;