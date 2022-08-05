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
git sparse-checkout add services/web
git checkout
cd ../

cp -a ship/services/web/ .

rm -rf ship

# Websocket config
cd web

npm uninstall @microsoft/signalr
rm src/services/socket.signalr.service.js
rm src/config/environment/development.dotnet.json

cd ..

# Install modules and setup husky

git init
npm install
git add .
git commit -m "initial commit"
git branch -M main

npx husky install
