#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
api_dir="$2"

mkdir "$project_name"
cd "$project_name"

git clone --quiet "https://github.com/paralect/ship"

cp -a ship/services/$api_dir/ .

rm -rf ship

# Install modules and setup husky

git init
npm install
git add .
git commit -m "initial commit"
git branch -M main
npx husky install
