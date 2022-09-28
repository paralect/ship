#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"

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

# Add github actions from deploy service

cp ship/deploy/digital-ocean-apps/common/.github/workflows/application-web-deployment.yml .github/workflows

# Remove unused folders and files
rm -rf ship

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
