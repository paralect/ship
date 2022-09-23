const { createSpinner } = require('nanospinner');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { apiTypes, dbTypes, buildTypes, apiFolders, deploymentFolders } = require('./config');

function getCLIArgs() {
  const args = process.argv.slice(2);
  
  if (args.length !== 1) {
    console.log(`
Invalid number of arguments.

Usage:
create-ship-app <project-name>
create-ship-app init
    `);
    process.exit(1);
  }
  
  return args;
}

function getDockerComposeFileName(apiType, dbType) {
  switch (apiType) {
    case apiTypes.KOA:
      return 'docker-compose-koa.yml';
    case apiTypes.DOTNET:
      switch (dbType) {
        case dbTypes.NOSQL:
          return 'docker-compose-dotnet-nosql.yml';
        case dbTypes.SQL:
          return 'docker-compose-dotnet-sql.yml';
      }
      break;
    default:
      return 'docker-compose-koa.yml';
  }
}

function getDeploymentFolderNames(deploymentType, apiType, dbType) {
  const deploymentCommonFolderName = deploymentFolders.common[deploymentType];
  const deploymentSpecificFolderName = deploymentFolders.specific[`${deploymentType || ''}${apiType || ''}${dbType || ''}`] || '';

  return {
    deploymentCommonFolderName,
    deploymentSpecificFolderName
  };
}

function getRunCommand(buildType, apiType) {
  switch (buildType) {
    case buildTypes.ONLY_FRONTEND:
      return 'npm run dev';
    case buildTypes.ONLY_BACKEND:
      switch (apiType) {
        case apiTypes.KOA:
          return 'docker-compose up --build';
        case apiTypes.DOTNET:
          return 'dotnet run';
        default:
          return;
      }
    case buildTypes.FULL_STACK:
      return 'npm start';
    default:
      return;
  }
}

async function installServices(projectName, buildType, deploymentType, apiType, dbType, dockerComposeFileName, deploymentFolderNames) {
  const spinner = createSpinner(`Building ${projectName}...`).start();
  
  switch (buildType) {
    case buildTypes.FULL_STACK:
      await exec(`bash ${__dirname}/scripts/full-stack.sh ${projectName} ${__dirname} ${apiFolders[apiType]} ${dockerComposeFileName} ${apiType} ${deploymentType} ${dbType} ${deploymentFolderNames.deploymentCommonFolderName} ${deploymentFolderNames.deploymentSpecificFolderName}`);
      break;
    case buildTypes.ONLY_FRONTEND:
      await exec(`bash ${__dirname}/scripts/frontend.sh ${projectName}`);
      break;
    case buildTypes.ONLY_BACKEND:
      await exec(`bash ${__dirname}/scripts/backend.sh ${projectName} ${__dirname} ${apiFolders[apiType]} ${apiType} ${dbType}`);
      break;
  }
  
  spinner.success({ text: 'Done!' });
}

module.exports = {
  getCLIArgs,
  getDockerComposeFileName,
  getDeploymentFolderNames,
  getRunCommand,
  installServices
}
