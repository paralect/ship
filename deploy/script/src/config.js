const path = require('path');
const rootDir = path.resolve(__dirname, './../../../');

const deployConfig =  {
  api: { dockerRepo: 'paralect/ship-api', dir: `${rootDir}/api` },
  web: { dockerRepo: 'paralect/ship-web', dir: `${rootDir}/web` },
  landing: { dockerRepo: 'paralect/ship-landing', dir: `${rootDir}/landing` },
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

  kubeConfig: ENV.KUBE_CONFIG,

  home: ENV.HOME,

  dockerRegistry: {
    username: ENV.DOCKER_AUTH_USERNAME,
    password: ENV.DOCKER_AUTH_PASSWORD,

    imageTag: ENV.IMAGE_TAG,
  },

  deploy: deployConfig,
};
