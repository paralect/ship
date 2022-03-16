const path = require('path');
const rootDir = path.resolve(__dirname, './../../../');

const deployConfig =  {
  api: {
    dockerRepo: 'registry.digitalocean.com/paralect/ship-api',
    dir: `${rootDir}/api`,
    folder: 'api',
    buildTarget: 'api',
  },
  web: {
    dockerRepo: 'registry.digitalocean.com/paralect/ship-web',
    dir: `${rootDir}/web`,
    folder: 'web',
  },
  scheduler: {
    dockerRepo: 'registry.digitalocean.com/paralect/ship-scheduler',
    dir: `${rootDir}/api`,
    buildTarget: 'scheduler',
  },
  migrator: {
    dockerRepo: 'registry.digitalocean.com/paralect/ship-migrator',
    dir: `${rootDir}/api`,
    buildTarget: 'migrator',
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

const ENV = process.env;

module.exports = {
  rootDir,

  service: ENV.SERVICE,

  environment: ENV.ENVIRONMENT || 'staging',

  namespace: ENV.NAMESPACE || 'staging',

  kubeConfig: ENV.KUBE_CONFIG,

  home: ENV.HOME,

  dockerRegistry: {
    username: ENV.DOCKER_AUTH_USERNAME,
    password: ENV.DOCKER_AUTH_PASSWORD,

    imageTag: ENV.IMAGE_TAG,
  },

  deploy: deployConfig,
};
