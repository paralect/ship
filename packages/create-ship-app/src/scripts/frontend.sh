#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
cli_dir="$2"
deployment_type="$3"
platform_common_dir="$4"
platform_specific_dir="$5"

filesToRemove=(
  "bin"
  "docker-compose.yml"
  ".github"
  ".husky"
)

function installService() {
  service="$1"
  service_dir="$2"

  cp -a "ship/$service_dir/." "$service"

  if [ "$service" != "deploy" ]; then
    cd "$service"
    rm -rf "${filesToRemove[@]}"
    cd ../
  fi
}

mkdir "$project_name"
cd "$project_name"

# Download only web service folder from monorepo

git clone --quiet --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/paralect/ship.git
cd ship
git sparse-checkout init --cone
git sparse-checkout add services/web deploy
git checkout
cd ../

cp -a ship/services/web/. .

if [ ! -z "$platform_common_dir" ]; then
  installService "deploy" "deploy/$platform_common_dir"
fi
if [ ! -z "$platform_specific_dir" ]; then
  installService "deploy" "deploy/$platform_specific_dir"
fi

rm -rf ship

# Add github actions from deploy service

mv deploy/.github/workflows/* .github/workflows

# Remove unused folders and files

bash $cli_dir/scripts/cleanup.sh "frontend" $deployment_type "api" $api_type $db_type

npm uninstall @microsoft/signalr
rm src/services/socket.signalr.service.ts
rm src/config/environment/development.dotnet.json

# Install modules and setup husky

git init
npm install
git add .
git commit -m "initial commit"
git branch -M main

npx husky install
