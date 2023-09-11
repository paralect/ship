#!/usr/bin/env node

const gradient = require('gradient-string');
const figlet = require('figlet');

const utils = require('./utils');
const { deploymentTypes } = require('./config');
const buildSteps = require('./build-steps');

let projectName;
let deploymentType = deploymentTypes.DIGITAL_OCEAN_APPS;

(async () => {
  console.clear();
  console.log(`Hey! Let’s build your ${gradient.pastel('Ship')} 🚀`);

  const [firstArg] = utils.getCLIArgs();

  if (firstArg === 'init') {
    projectName = await buildSteps.askProjectName();
  } else {
    projectName = firstArg;
    console.log(`Project name: ${projectName}`);
  }

  deploymentType = await buildSteps.askDeploymentType();

  await utils.installServices(projectName, deploymentType);

  figlet('Happy coding!', (err, data) => {
    console.log(gradient.pastel.multiline(data) + '\n');
    console.log(`Run application: cd ${projectName} && pnpm start`);
    process.exit(0);
  });
})();
