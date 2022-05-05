const { createSpinner } = require('nanospinner');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { apiTypes, dbTypes, buildTypes, apiFolders, deploymentTypes } = require('./config');

function getCLIArgs() {
  const args = process.argv.slice(2);
  
  if (args.length !== 1) {
    console.log(`Invalid number of arguments.

Usage:
ship <project-name>
ship init
    `);
    process.exit(1);
  }
  
  return args[0];
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
  let platformCommonFolderName;
  let platformSpecificFolderName;

  switch (deploymentType) {
    case deploymentTypes.AWS:
      platformCommonFolderName = 'aws-common';

      switch (apiType) {
        case apiTypes.KOA:
          platformSpecificFolderName = 'aws-koa';
          break;
        case apiTypes.DOTNET:
          switch (dbType) {
            case dbTypes.NOSQL:
              platformSpecificFolderName = 'aws-dotnet-nosql';
              break;
            case dbTypes.SQL:
              platformSpecificFolderName = 'aws-dotnet-sql';
              break;
            default:
              platformSpecificFolderName = 'aws-dotnet-nosql';
              break;
          }
        default:
          platformSpecificFolderName = 'aws-koa';
          break;
      }
      break;

    case deploymentTypes.DIGITAL_OCEAN:
      platformCommonFolderName = 'digital-ocean';
      platformSpecificFolderName = null;
      break;

    default:
      platformCommonFolderName = 'digital-ocean';
      platformSpecificFolderName = null;
      break;
  }

  return {
    platformCommonFolderName,
    platformSpecificFolderName
  }
}

function getRunCommand(buildType, apiType) {
  switch (buildType) {
    case buildTypes.ONLY_FRONTEND:
      return 'npm run dev';
    case buildTypes.ONLY_BACKEND:
      switch (apiType) {
        case apiType.KOA:
          return 'docker-compose up --build';
        case apiType.DOTNET:
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

async function installServices(projectName, buildType, apiType, dbType, dockerComposeFileName, deploymentFolderNames) {
  const spinner = createSpinner(`Building ${projectName}...`).start();
  
  switch (buildType) {
    case buildTypes.FULL_STACK:
      await exec(`bash ${__dirname}/scripts/full-stack.sh ${projectName} ${__dirname} ${apiFolders[apiType]} ${dockerComposeFileName} ${apiType} ${dbType} ${deploymentFolderNames.platformCommonFolderName} ${deploymentFolderNames.platformSpecificFolderName}`);
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
