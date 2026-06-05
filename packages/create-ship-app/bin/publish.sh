#!/bin/bash

# exit when any command fails
set -e

red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
blue=`tput setaf 4`

reset=`tput sgr0`

VERSION=$1
PRIMARY='@paralect/ship'
ALIAS='create-ship-app'

if [ -z "$1" ] ; then
  echo "${red}[!] Version is not specified. Exiting.${reset}"
  echo "USAGE: ./bin/publish.sh [version]. "
  echo "  e.g.: ${green}./bin/publish.sh 3.0.0${reset} (or ${green}major${reset} / ${green}minor${reset} / ${green}patch${reset})"
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $SCRIPT_DIR/..
echo ">>> Publishing ${blue}$PRIMARY${reset} (+ alias ${blue}$ALIAS${reset})"
echo ">>> Removing node_modules and dist"
rm -rf node_modules && rm -rf dist

echo ">>> pnpm install"
pnpm install 1>/dev/null

MODULE_VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
echo ">>> Current version is ${yellow}$MODULE_VERSION${reset}"
echo ">>> Bumping version to ${yellow}$VERSION${reset}"
npm version $VERSION

echo ">>> pnpm run build"
pnpm run build 1>/dev/null

# Publish the primary scoped package. publishConfig.access=public makes the
# scoped package public.
echo ">>> npm publish ${blue}$PRIMARY${reset}"
npm publish

# Publish the same built dist under the legacy unscoped name so
# `npx create-ship-app@latest` keeps working. We temporarily swap the `name`
# field, publish, then restore it — the bin map already exposes both `ship`
# and `create-ship-app`, so no other change is needed.
echo ">>> npm publish ${blue}$ALIAS${reset} (same dist, name-swapped)"
node -e "const fs=require('fs');const p=require('./package.json');p.name='$ALIAS';fs.writeFileSync('./package.json', JSON.stringify(p, null, 2)+'\n');"
npm publish --access public
node -e "const fs=require('fs');const p=require('./package.json');p.name='$PRIMARY';fs.writeFileSync('./package.json', JSON.stringify(p, null, 2)+'\n');"

NEW_VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
echo ">>> Uploaded ${blue}$PRIMARY@$NEW_VERSION${reset} and ${blue}$ALIAS@$NEW_VERSION${reset} to npm"
echo "${green}Success!${reset}"
