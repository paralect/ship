#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
deployment_type="$2"
platform_common_dir="$3"
platform_specific_dir="$4"

# Clone project and create template

mkdir "$project_name"
cd "$project_name"

git clone https://github.com/paralect/ship.git
cp -a ship/template/. .

# Rename services in docker-compose.yml

for i in docker-compose*; do
  perl -i -pe"s/ship/$project_name/g" $i
done

# Websocket config
cd apps/web

npm uninstall @microsoft/signalr
rm src/services/socket.signalr.service.ts

cd ../../

# Install deploy

if [ "$deployment_type" == "Digital_Ocean_Apps" ]; then
  cp -a "ship/deploy/$platform_specific_dir/.github/workflows/." ".github/workflows"
fi

if [ "$deployment_type" == "Render" ]; then
  cp "ship/deploy/$platform_specific_dir/render.yaml" "."

  perl -i -pe"s/ship/$project_name/g" render.yaml
fi

if [ "$deployment_type" == "Digital_Ocean_Managed_Kubernetes" ] || [ "$deployment_type" == "AWS_EKS" ]; then
  cp -a "ship/deploy/$platform_common_dir/." "deploy"
  cp -a "ship/deploy/$platform_specific_dir/." "deploy"

  mv deploy/.github/workflows/* .github/workflows
  rm -rf deploy/.github
fi

rm -rf ship

# Install pnpm
npm i -g pnpm

# Install modules and setup husky
pnpm i --prefer-frozen-lockfile --ignore-scripts
git init
git add .
git commit -m "initial commit"
git branch -M main

pnpm husky install
