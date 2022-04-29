#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
cli_dir="$2"
api_dir="$3"
api_type="$4"
db_type="$5"

mkdir "$project_name"
cd "$project_name"

git clone --quiet "https://github.com/paralect/ship"

cp -a ship/services/$api_dir/ api

rm -rf ship

bash $cli_dir/scripts/cleanup.sh $api_type $db_type

# Install modules and setup husky

git init
npm install
git add .
git commit -m "initial commit"
git branch -M main
npx husky install
