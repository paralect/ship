const inquirer = require('inquirer');

const { deploymentTypes } = require('./config');

async function askProjectName() {
  const answers = await inquirer.prompt({
    name: 'projectName',
    type: 'input',
    message: 'What’s your project name:',
    default() {
      return 'ship';
    },
  });

  return answers.projectName;
}

async function askDeploymentType() {
  const answers = await inquirer.prompt({
    name: 'deploymentType',
    type: 'list',
    message: 'Choose your deployment type:',
    choices: Object.values(deploymentTypes),
    default() {
      return deploymentTypes.DIGITAL_OCEAN_APPS;
    },
  });

  return answers.deploymentType;
}

module.exports = {
  askProjectName,
  askDeploymentType,
}
