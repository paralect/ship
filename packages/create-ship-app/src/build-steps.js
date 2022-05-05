const inquirer = require('inquirer');

const { buildTypes, apiTypes, dbTypes, deploymentTypes } = require('./config');

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

async function askBuildType() {
  const answers = await inquirer.prompt({
    name: 'buildType',
    type: 'list',
    message: 'Choose your build type:',
    choices: Object.values(buildTypes),
    default() {
      return buildTypes.FULL_STACK;
    },
  });
  
  return answers.buildType;
}

async function askApiType() {
  const answers = await inquirer.prompt({
    name: 'apiType',
    type: 'list',
    message: 'Choose your API type:',
    choices: Object.values(apiTypes),
    default() {
      return apiTypes.KOA;
    },
  });
  
  return answers.apiType;
}

async function askDbType() {
  const answers = await inquirer.prompt({
    name: 'dbType',
    type: 'list',
    message: 'Choose your DB type:',
    choices: Object.values(dbTypes),
    default() {
      return dbTypes.NOSQL;
    },
  });
  
  return answers.dbType;
}

async function askDeploymentType() {
  const answers = await inquirer.prompt({
    name: 'deploymentType',
    type: 'list',
    message: 'Choose your cloud service provider to deploy:',
    choices: Object.values(deploymentTypes),
    default() {
      return deploymentTypes.DIGITAL_OCEAN;
    },
  });
  
  return answers.deploymentType;
}

module.exports = {
  askProjectName,
  askBuildType,
  askApiType,
  askDbType,
  askDeploymentType,
}
