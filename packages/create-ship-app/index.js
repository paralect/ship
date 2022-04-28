#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const gradient = require('gradient-string');
const figlet = require('figlet');
const { createSpinner } = require('nanospinner');

let projectName;
let buildType;
let apiType;
let dbType;
let deploymentService;

async function start() {
  console.clear();
  
  const myArgs = process.argv.slice(2);
  
  if (myArgs.length !== 1) {
    console.log(`Invalid number of arguments.

Usage:
ship <project-name>
ship init
    `);
    process.exit(1);
  }
  
  console.log(`Hey! Let’s build your ${gradient.pastel('Ship')} 🚀
  `);
  
  if (myArgs[0] === 'init') {
    await askProjectName();
  } else {
    projectName = myArgs[0];
    console.log(`Project name: ${projectName}`);
  }
}

async function askProjectName() {
  const answers = await inquirer.prompt({
    name: 'projectName',
    type: 'input',
    message: 'What’s your project name:',
    default() {
      return 'ship';
    },
  });
  
  projectName = answers.projectName;
}

const buildTypes = {
  FULL_STACK: 'Full-Stack (Frontend, Backend, Deploy)',
  ONLY_FRONTEND: 'Only Frontend',
  ONLY_BACKEND: 'Only Backend',
};

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
  
  buildType = answers.buildType;

  if (buildType === buildTypes.ONLY_BACKEND || buildType === buildTypes.FULL_STACK) {
    await askApiType();

    if (apiType === apiTypes.DOTNET) {
      await askDbType();
    }
  }
  
  if (buildType === buildTypes.FULL_STACK) {
    await askDeploymentService();
  }
}

const apiTypes = {
  KOA: 'Koa.js',
  DOTNET: '.NET',
};

const apiFolders = {
  [apiTypes.KOA]: 'api-koa',
  [apiTypes.DOTNET]: 'api-dotnet',
};

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
  
  apiType = answers.apiType;
}

const dbTypes = {
  NOSQL: 'MongoDB',
  SQL: 'PostgreSQL',
};

async function askDbType() {
  const answers = await inquirer.prompt({
    name: 'dbType',
    type: 'list',
    message: 'Choose your DB type:',
    choices: Object.values(dbTypes),
    default() {
      return dbTypes.MONGODB;
    },
  });
  
  dbType = answers.dbType;
}

function getDockerComposeFileName() {
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

const deploymentFolders = {
  'Digital Ocean': 'digital-ocean',
  AWS: 'aws',
};

async function askDeploymentService() {
  const answers = await inquirer.prompt({
    name: 'deploymentService',
    type: 'list',
    message: 'Choose your cloud service provider to deploy:',
    choices: [
      'Digital Ocean',
      'AWS',
    ],
    default() {
      return 'Digital Ocean';
    },
  });
  
  deploymentService = answers.deploymentService;
}

async function installServices() {
  const spinner = createSpinner(`Building ${projectName}...`).start();

  const dockerComposeFileName = getDockerComposeFileName();

  switch (buildType) {
    case buildTypes.FULL_STACK:
      await exec(`bash ${__dirname}/scripts/full-stack.sh ${projectName} ${__dirname} ${apiFolders[apiType]} ${dockerComposeFileName} ${deploymentFolders[deploymentService]}`);
      break;
    case buildTypes.ONLY_FRONTEND:
      await exec(`bash ${__dirname}/scripts/frontend.sh ${projectName}`);
      break;
    case buildTypes.ONLY_BACKEND:
      await exec(`bash ${__dirname}/scripts/backend.sh ${projectName} ${apiFolders[apiType]}`);
      break;
  }

  spinner.success({ text: 'Done!' });
}

function finish() {
  figlet('Happy coding!', (err, data) => {
    const runCommand = buildType === buildTypes.ONLY_FRONTEND
      ? 'npm run dev'
      : 'npm start';
    
    console.log(gradient.pastel.multiline(data) + '\n');
    console.log(`Run application: cd ${projectName} && ${runCommand}`);
    process.exit(0);
  });
}

(async () => {
  await start();
  await askBuildType();
  await installServices();
  finish();
})();
