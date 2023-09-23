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
    dockerContextDir: rootDir,
    folder: 'api',
    dockerFilePath: `${rootDir}/apps/api/Dockerfile`
  },
  web: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/web`,
    dockerContextDir: rootDir,
    folder: 'web',
    dockerFilePath: `${rootDir}/apps/web/Dockerfile`
  },
  scheduler: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/scheduler`,
    dockerContextDir: rootDir,
    folder: 'scheduler',
    dockerFilePath: `${rootDir}/apps/api/Dockerfile.scheduler`,
  },
  migrator: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/migrator`,
    dockerContextDir: rootDir,
    dockerFilePath: `${rootDir}/apps/api/Dockerfile.migrator`,
  }
};

config.deploy = deployConfig;

module.exports = config;

