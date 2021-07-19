const path = require('path');
const rootDir = path.resolve(__dirname, './../../../');

// AWS only

// const DEFAULT_AWS_REGION = 'region-code';
// const DEFAULT_AWS_ACCOUNT_ID = '666666666666';

const deployConfig =  {
  api: {
    dockerRepo: 'registry.digitalocean.com/paralect/ship-api',
    dir: `${rootDir}/api`,
    folder: 'api',
  },
  web: {
    dockerRepo: 'registry.digitalocean.com/paralect/ship-web',
    dir: `${rootDir}/web`,
    folder: 'web',
  },
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
    // DO only
    username: ENV.DOCKER_AUTH_USERNAME,
    password: ENV.DOCKER_AUTH_PASSWORD,

    imageTag: ENV.IMAGE_TAG,
  },

  deploy: deployConfig,

  // AWS only

  // clusterName: ENV.CLUSTER_NAME || 'cluster-name',

  // AWS: {
  //   accessKey: ENV.AWS_ACCESS_KEY,
  //   secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  //   region: ENV.AWS_REGION || DEFAULT_AWS_REGION,
  //   accountId: ENV.AWS_ACCOUNT_ID || DEFAULT_AWS_ACCOUNT_ID,
  // },
};
