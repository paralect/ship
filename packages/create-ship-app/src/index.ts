#!/usr/bin/env node

import { Command } from 'commander';
import Conf from 'conf';
import fs from 'fs';
import gradient from 'gradient-string';
import path from 'path';
import { blue, bold, cyan, gray, green, red, yellow } from 'picocolors';
import prompts from 'prompts';
import checkForUpdate from 'update-check';

import {
  createResource,
  getDefaultProjectName,
  handleSigTerm,
  isFolderEmpty,
  onPromptState,
  validateNpmName,
} from 'helpers';

import config from 'config';

import { Deployment } from 'types';
import { DEPLOYMENT_SHORTCUTS } from 'app.constants';

import packageJson from '../package.json';
import { createApp, DownloadError } from './create-app';

let projectPath = getDefaultProjectName();
let rawArgs: string[] = [];

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

const program = new Command();

program
  .name(packageJson.name)
  .description('Initialize Ship app with one command')
  .version(packageJson.version)
  .argument('[project-directory]')
  .usage(`${green('[project-directory]')} [options]`)
  .action((projectName, options, command) => {
    rawArgs = command.args;
    projectPath = projectName || '';
  })
  .option(
    '-d, --deployment <type>',
    `

An deployment type for the application.

Available deployment options:
  do-apps            Digital Ocean Apps
  render             Render
  do-kubernetes      Digital Ocean Managed Kubernetes
  aws-eks            AWS EKS
`,
  )
  .allowUnknownOption();

program.parse(process.argv);

const run = async (): Promise<void> => {
  // rawArgs = ['create', 'resource', <resource-name>];
  const isCommandCreateResource = rawArgs.length === 3 && rawArgs[0] === 'create' && rawArgs[1] === 'resource';

  if (isCommandCreateResource) {
    await createResource(rawArgs[2].toLowerCase());

    console.log(`Resource ${rawArgs[2]} created successfully.`);

    return;
  }

  const conf = new Conf({ projectName: 'create-ship-app' });

  console.clear();
  console.log(`Hey! Let’s build your ${gradient.pastel('Ship')} 🚀`);
  console.log();

  projectPath = projectPath.trim();

  if (projectPath === 'init') {
    projectPath = '';
  }

  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: 'text',
      name: 'path',
      message: 'What is the name of your project?',
      initial: 'my-ship-app',
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)));

        if (validation.valid) {
          return true;
        }

        return `Invalid project name: ${validation.problems![0]}`;
      },
    });

    if (typeof res.path === 'string') {
      projectPath = res.path.trim();
    }
  } else {
    console.log(`${green('✔')} ${bold('What is the name of your project?')} ${gray('…')} ${green(projectPath)}`);
  }

  if (!projectPath) {
    console.log(
      '\nPlease specify the project directory:\n' +
        `  ${cyan(program.name())} ${green('<project-directory>')}\n` +
        'For example:\n' +
        `  ${cyan(program.name())} ${green('my-ship-app')}\n\n` +
        `Run ${cyan(`${program.name()} --help`)} to see all options.`,
    );

    process.exit(1);
  }

  let resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  if (config.TEMP_DIR_PATH) {
    resolvedProjectPath = path.join(config.TEMP_DIR_PATH, projectName);
  }

  const { valid, problems } = validateNpmName(projectName);

  if (!valid) {
    console.error(`Could not create a project called ${red(`"${projectName}"`)} because of npm naming restrictions:`);
    problems!.forEach((p) => console.error(`    ${red(bold('*'))} ${p}`));

    process.exit(1);
  }

  const root = path.resolve(resolvedProjectPath);

  const appName = path.basename(root);
  let folderExists = fs.existsSync(root);

  if (folderExists && config.USE_TEMP_DIR && config.CLEANUP_TEMP_DIR) {
    fs.rmSync(root, { recursive: true });

    folderExists = fs.existsSync(root);
  }

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const preferences: Partial<Record<string, string | Deployment>> = conf.get('preferences') || {};

  const options = program.opts();

  if (options.deployment) {
    const chosenDeployment = DEPLOYMENT_SHORTCUTS[options.deployment as keyof typeof DEPLOYMENT_SHORTCUTS];

    if (chosenDeployment) {
      options.deployment = chosenDeployment;

      console.log(
        `${green('✔')} ${bold(`What ${blue('deployment type')} would you like to use?`)} ${gray('›')} ${green(chosenDeployment)}`,
      );
    } else {
      options.deployment = undefined;
    }
  }

  if (typeof options.deployment !== 'string' || !options.deployment.length) {
    const { deployment } = await prompts({
      onState: onPromptState,
      type: 'select',
      name: 'deployment',
      message: `What ${blue('deployment type')} would you like to use?`,
      initial: 0,
      choices: [
        { title: Deployment.DIGITAL_OCEAN_APPS, value: Deployment.DIGITAL_OCEAN_APPS },
        { title: Deployment.RENDER, value: Deployment.RENDER },
        { title: Deployment.DIGITAL_OCEAN_KUBERNETES, value: Deployment.DIGITAL_OCEAN_KUBERNETES },
        { title: Deployment.AWS_KUBERNETES, value: Deployment.AWS_KUBERNETES },
      ],
    });

    options.deployment = deployment;
    preferences.deployment = deployment;
  }

  try {
    await createApp({
      projectName,
      appPath: resolvedProjectPath,
      deployment: options.deployment,
    });
  } catch (reason) {
    if (!(reason instanceof DownloadError)) {
      throw reason;
    }

    const res = await prompts({
      onState: onPromptState,
      type: 'confirm',
      name: 'builtin',
      message:
        'Could not download template because of a connectivity issue between your machine and GitHub.\n' +
        'Do you want to try again?',
      initial: true,
    });

    if (!res.builtin) {
      throw reason;
    }

    await createApp({
      projectName,
      appPath: resolvedProjectPath,
      deployment: options.deployment,
    });
  }

  conf.set('preferences', preferences);
};

const update = checkForUpdate(packageJson).catch(() => null);

const notifyUpdate = async (): Promise<void> => {
  try {
    const res = await update;

    if (res?.latest) {
      const updateMessage = 'pnpm add -g create-ship-app';

      console.log(
        `${yellow(bold('A new version of `create-ship-app` is available!'))}\n` +
          `Update by running: ${cyan(updateMessage)}\n`,
      );

      process.exit(1);
    }

    process.exit();
  } catch {
    console.log('Something went wrong. Code UPDMSG');
  }
};

run()
  .then(notifyUpdate)
  .catch(async (reason) => {
    console.log();
    console.log('Aborting installation.');

    if (reason.command) {
      console.log(`  ${cyan(reason.command)} has failed.`);
    } else {
      console.log(`${red('Unexpected error. Please report it as a bug:')}\n`, reason);
    }
    console.log();

    await notifyUpdate();

    process.exit(1);
  });
