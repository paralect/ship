const { createSpinner } = require('nanospinner');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { apiTypes, dbTypes, apiFolders, deploymentFolders } = require('./config');

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

function getDockerComposeFileName(dbType) {
  switch (dbType) {
    case dbTypes.NOSQL:
      return 'docker-compose-dotnet-nosql.yml';
    case dbTypes.SQL:
      return 'docker-compose-dotnet-sql.yml';
    default:
      return 'docker-compose-dotnet-sql.yml';
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

async function installServices(projectName, deploymentType, apiType, dbType) {
  const spinner = createSpinner(`Building ${projectName}...`).start();
  
  const formattedDeploymentType = deploymentType.replace(/ /g, '_');
  const deploymentFolderNames = getDeploymentFolderNames(deploymentType, apiType, dbType);
  
  if (apiType === apiTypes.KOA) {
    await exec(`bash ${__dirname}/scripts/node-js.sh ${projectName} ${formattedDeploymentType} ${deploymentFolderNames.deploymentCommonFolderName} ${deploymentFolderNames.deploymentSpecificFolderName}`);
  }
  
  if (apiType === apiTypes.DOTNET) {
    const dockerComposeFileName = getDockerComposeFileName(dbType);
    
    await exec(`bash ${__dirname}/scripts/dot-net.sh ${projectName} ${__dirname} ${apiFolders[apiType]} ${dockerComposeFileName} ${apiType} ${formattedDeploymentType} ${dbType} ${deploymentFolderNames.deploymentCommonFolderName} ${deploymentFolderNames.deploymentSpecificFolderName}`);
  }
  
  spinner.success({ text: 'Done!' });
}

module.exports = {
  getCLIArgs,
  installServices
}
