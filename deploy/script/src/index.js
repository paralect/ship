const fs = require('fs');

const config = require('./config');
const { execCommand } = require('./util');
const List = require('prompt-list');

const askServiceToDeploy = async () => {
  const choices = Object.keys(config.deploy);
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

// const dockerIgnore = `
// node_modules
// `;

const buildAndPushImage = async ({ dockerFilePath, dockerRepo, dockerContextDir, imageTag }) => {
  await execCommand(`docker build -f ${dockerFilePath} -t ${dockerRepo} ${dockerContextDir}`);
  await execCommand(`docker tag ${dockerRepo} ${imageTag}`);
  await execCommand(`docker push ${imageTag}`);
}

const pushToKubernetes = async ({ imageTag, appName, deployConfig }) => {
  const deployDir = `${config.rootDir}/deploy/app/${deployConfig.folder}`;

  if (config.kubeConfig) {
    console.log('Creating kubeconfig');
    fs.mkdirSync(`${config.home}/.kube`);
    fs.writeFileSync(`${config.home}/.kube/config`, config.kubeConfig);
  }

  await execCommand(`
    helm upgrade --install apps-${config.environment}-${appName} ${deployDir} --namespace ${config.namespace} \
      --set appname=${appName} \
      --set imagesVersion=${imageTag} \
      -f ${deployDir}/${config.environment}.yaml \
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

  await buildAndPushImage({ ...deployConfig, imageTag: `${deployConfig.dockerRepo}:${imageTag}` });

  await pushToKubernetes({ imageTag, appName: deployConfig.name, deployConfig });
}

deploy();
