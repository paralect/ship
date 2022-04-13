#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const gradient = require('gradient-string');
const figlet = require('figlet');
const { createSpinner } = require('nanospinner');

let projectName;
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

const deploymentFolder = {
  'Digital Ocean': 'deploy-digital-ocean',
  AWS: 'deploy-aws',
}

async function askDeploymentService() {
  const answers = await inquirer.prompt({
    name: 'deploymentService',
    type: 'list',
    message: 'Choose your cloud service provider to deploy: ',
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
  
  await exec(`bash ${__dirname}/merge-script.sh ${projectName} ${deploymentFolder[deploymentService]} ${__dirname}`);
  
  spinner.success({ text: 'Done!' });
}

function finish() {
  figlet('Happy coding!', (err, data) => {
    console.log(gradient.pastel.multiline(data) + '\n');
    process.exit(0);
  });
  
  console.log(`Run application: cd ${projectName} && npm start`);
}

(async () => {
  await start();
  await askDeploymentService();
  await installServices();
  finish();
})();
