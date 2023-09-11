const { createSpinner } = require('nanospinner');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { deploymentFolders } = require('./config');

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

function getDeploymentFolderNames(deploymentType) {
  const deploymentCommonFolderName = deploymentFolders.common[deploymentType];
  const deploymentSpecificFolderName = deploymentFolders.specific[`${deploymentType || ''}`] || '';

  return {
    deploymentCommonFolderName,
    deploymentSpecificFolderName
  };
}

async function installServices(projectName, deploymentType) {
  const spinner = createSpinner(`Building ${projectName}...`).start();

  const formattedDeploymentType = deploymentType.replace(/ /g, '_');
  const deploymentFolderNames = getDeploymentFolderNames(deploymentType);

  await exec(`bash ${__dirname}/scripts/node-js.sh ${projectName} ${formattedDeploymentType} ${deploymentFolderNames.deploymentCommonFolderName} ${deploymentFolderNames.deploymentSpecificFolderName}`);

  spinner.success({ text: 'Done!' });
}

module.exports = {
  getCLIArgs,
  installServices
}
