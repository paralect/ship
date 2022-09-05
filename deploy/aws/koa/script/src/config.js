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
  
  imageTag: ENV.IMAGE_TAG,
  
  nodeGroup: 'pool-app',

  AWS: {
    clusterName: ENV.CLUSTER_NAME,
    accessKey: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
    region: ENV.AWS_REGION,
    accountId: ENV.AWS_ACCOUNT_ID,
  },
};

const deployConfig =  {
  api: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/api`,
    dir: rootDir,
    folder: 'api',
    dockerFilePath: `${rootDir}/apps/api/Dockerfile`
  },
  web: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/web`,
    dir: rootDir,
    folder: 'web',
    dockerFilePath: `${rootDir}/apps/web/Dockerfile`
  },
  scheduler: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/scheduler`,
    dir: rootDir,
    folder: 'scheduler',
    dockerFilePath: `${rootDir}/apps/api/Dockerfile.scheduler`,
  },
  migrator: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/migrator`,
    dir: rootDir,
    dockerFilePath: `${rootDir}/apps/api/Dockerfile.migrator`,
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

