#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
deployment_type="$2"
platform_common_dir="$3"
platform_specific_dir="$4"

# Clone project and create template

git clone -b as_implement-turborepo https://github.com/paralect/ship.git
cp -a "ship/template/." "$project_name"

cd "$project_name"

# Rename services in docker-compose.yml

for i in docker-compose*; do
  perl -i -pe"s/ship/$project_name/g" $i
done

# Websocket config
cd apps/web

npm uninstall @microsoft/signalr
rm src/services/socket.signalr.service.ts
rm src/config/environment/development.dotnet.json

cd ../../../

# Install deploy

if [ "$deployment_type" == "Digital_Ocean_Apps" ]; then
  cp -a "ship/deploy/$platform_specific_dir/.github/workflows/*" "$project_name/.github/workflows"
  cp -a "ship/deploy/$platform_specific_dir/Dockerfile" "$project_name/apps/api"
else
  cp -a "ship/deploy/$platform_common_dir/." "$project_name/deploy"
  cp -a "ship/deploy/$platform_specific_dir/." "$project_name/deploy"

  cd "$project_name"

  mv deploy/.github/workflows/* .github/workflows
  rm -rf deploy/.github

  cd ../
fi

rm -rf ship
cd "$project_name"

# Install modules and setup husky

npm install
git init
git add .
git commit -m "initial commit"
git branch -M main

npx husky install
