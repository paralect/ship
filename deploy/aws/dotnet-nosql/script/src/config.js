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
    dir: `${rootDir}/api/src`,
    dockerFilePath: `${rootDir}/api/src/app/Api.NoSql/Dockerfile`,
    folder: 'api',
  },
  web: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/web`,
    dir: `${rootDir}/web`,
    folder: 'web',
  },
  scheduler: {
    dockerRepo: `${config.AWS.accountId}.dkr.ecr.${config.AWS.region}.amazonaws.com/scheduler`,
    dir: `${rootDir}/api/src`,
    dockerFilePath: `${rootDir}/api/src/app/Scheduler/Dockerfile`,
    folder: 'scheduler',
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

