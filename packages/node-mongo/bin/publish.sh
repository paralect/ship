#!/bin/bash

# exit when any command fails
set -e

red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
blue=`tput setaf 4`

reset=`tput sgr0`

VERSION=$1
MODULE='node-mongo'

if [ -z "$1" ] ; then
  echo "${red}[!] Version is not specified. Exiting.${reset}"
  echo "USAGE: ./bin/publish.sh [version]. "
  echo "  e.g.: ${green}./bin/publish.sh schema${reset} "
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $SCRIPT_DIR/..
echo ">>> Publishing module: $MODULE"
echo ">>> Removing node_modules in $MODULE"
rm -rf node_modules

echo ">>> npm install for $MODULE"
npm install 1>/dev/null

echo ">>> npm run test:eslint && npm run build && npm publish"
MODULE_VERSION=$(grep version package.json | sed 's/.*"version": "\(.*\)".*/\1/')

echo ">>> Current version for module: ${blue}@paralect/$MODULE${reset} is ${yellow}$MODULE_VERSION${reset}"
echo ">>> Bumping version to ${yellow}$VERSION${reset}"
npm run test:eslint 1>/dev/null && npm run build 1>/dev/null && npm version $VERSION && npm publish

MODULE_VERSION_NEW=$(grep version package.json | sed 's/.*"version": "\(.*\)".*/\1/')

MODULE_NAME_VERSION="@paralect/$MODULE@$MODULE_VERSION_NEW"
echo ">>> Uploaded ${blue}$MODULE_NAME_VERSION${reset} to npm repo"

echo "${green}Success!${reset}"
echo "Make sure to update the package.json of any other service that uses pacakge '$MODULE' and reinstall node_modules if necessary."
