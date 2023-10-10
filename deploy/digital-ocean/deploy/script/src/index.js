const fs = require('fs');
const List = require('prompt-list');

const config = require('./config');
const { execCommand } = require('./util');

const askServiceToDeploy = async () => {
  const utils = ['migrator', 'scheduler'];
  const choices = Object.keys(config.deploy).filter((c) => !utils.includes(c));
  
  let serviceToDeploy;
  
  if (config.service) {
    serviceToDeploy = config.service;
    
    if (!choices.includes(serviceToDeploy)) {
      throw new Error(`Wrong service specified to deploy [${serviceToDeploy}]. Aborting`);
    }
  } else {
    const list = new List({
      name: 'service',
      message: 'What service to deploy?',
      choices,
    });
    
    serviceToDeploy = await list.run();
  }
  
  const serviceConfig = config.deploy[serviceToDeploy];
  serviceConfig.name = serviceToDeploy;
  
  return serviceConfig;
};

const buildAndPushImage = async ({ dockerFilePath, dockerRepo, dockerContextDir, imageTag, environment }) => {
  await execCommand(`docker build \
    --build-arg APP_ENV=${environment} \
    -f ${dockerFilePath} \
    -t ${dockerRepo} \
    ${dockerContextDir}`);
  await execCommand(`docker tag ${dockerRepo} ${imageTag}`);
  await execCommand(`docker push ${imageTag}`);
}

const pushToKubernetes = async ({ imageTag, appName, deployConfig }) => {
  const deployDir = `${config.rootDir}/deploy/app/${deployConfig.folder}`;
  
  if (config.kubeConfig && !fs.existsSync(`${config.home}/.kube/config`)) {
    console.log('Creating kubeconfig');
    fs.mkdirSync(`${config.home}/.kube`);
    fs.writeFileSync(`${config.home}/.kube/config`, config.kubeConfig);
  }
  
  await execCommand(`
    helm upgrade --install apps-${config.environment}-${appName} ${deployDir} \
      --namespace ${config.namespace} --create-namespace \
      --set appname=${appName} \
      --set imagesVersion=${imageTag} \
      --set nodePool=${config.nodePool} \
      --set containerRegistry=${config.dockerRegistry.name} \
      -f ${deployDir}/${config.environment}.yaml \
      --timeout 35m \
  `);
}

const deploy = async () => {
  if (config.dockerRegistry.password) {
    await execCommand(`docker login --username ${config.dockerRegistry.username} --password ${config.dockerRegistry.password} registry.digitalocean.com`);
  }
  const deployConfig = await askServiceToDeploy();
  
  let imageTag = config.dockerRegistry.imageTag;
  
  if (!imageTag) {
    const { stdout: branch } = await execCommand('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' });
    const { stdout: commitSHA } = await execCommand('git rev-parse HEAD', { stdio: 'pipe' });
    
    imageTag = `${branch}.${commitSHA}`;
  }
  
  if (deployConfig.name === 'api') {
    // push migrator image to registry
    await buildAndPushImage({
      ...config.deploy.migrator,
      imageTag: `${config.deploy.migrator.dockerRepo}:${imageTag}`,
      environment: config.environment
    });
    
    // push api image to registry
    await buildAndPushImage({
      ...deployConfig,
      imageTag: `${deployConfig.dockerRepo}:${imageTag}`,
      environment: config.environment
    });
    
    // deploy api to kubernetes and deploy migrator through helm hooks
    await pushToKubernetes({
      imageTag,
      appName: 'api',
      deployConfig
    });
    
    // push scheduler image to registry
    await buildAndPushImage({
      ...config.deploy.scheduler,
      imageTag: `${config.deploy.scheduler.dockerRepo}:${imageTag}`,
      environment: config.environment
    });
    
    // deploy scheduler to kubernetes
    await pushToKubernetes({
      imageTag,
      appName: 'scheduler',
      deployConfig: config.deploy.scheduler
    });
  }
  
  if (deployConfig.name === 'web') {
    // push web image to registry
    await buildAndPushImage({
      ...deployConfig,
      imageTag: `${deployConfig.dockerRepo}:${imageTag}`,
      environment: config.environment
    });
    
    // deploy web to kubernetes
    await pushToKubernetes({
      imageTag,
      appName: 'web',
      deployConfig
    });
  }
}

deploy();

process.on('unhandledRejection', (error) => {
  console.error(error);
  process.exit(1);
});
