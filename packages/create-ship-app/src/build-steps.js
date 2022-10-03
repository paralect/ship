const inquirer = require('inquirer');

const { apiTypes, dbTypes, deploymentTypes } = require('./config');

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

async function askDeploymentType(apiType) {
  const answers = await inquirer.prompt({
    name: 'deploymentType',
    type: 'list',
    message: 'Choose your deployment type:',
    choices: apiType === apiTypes.KOA
      ? Object.values(deploymentTypes)
      : Object.values(deploymentTypes).filter((d) => d !== deploymentTypes.DIGITAL_OCEAN_APPS)
    ,
    default() {
      return deploymentTypes.DIGITAL_OCEAN_APPS;
    },
  });
  
  return answers.deploymentType;
}

module.exports = {
  askProjectName,
  askApiType,
  askDbType,
  askDeploymentType,
}
