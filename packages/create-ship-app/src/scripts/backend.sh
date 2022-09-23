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

# Download only services folder from monorepo

git clone --quiet --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/paralect/ship.git
cd ship
git sparse-checkout init --cone
git sparse-checkout add services deploy
git checkout
cd ../

cp -a ship/services/$api_dir/. .

# Rename services in docker-compose.yml

for i in docker-compose*; do
  perl -i -pe"s/ship/$project_name/g" $i
done

# Add github actions from deploy service

mkdir -p .github/workflows
cp ship/deploy/digital-ocean-apps/common/.github/workflows/application-api-deployment.yml .github/workflows

# Remove unused folders and files
rm -rf ship

bash $cli_dir/scripts/cleanup.sh "." $api_type $db_type

# Install modules and setup husky

git init
npm install
git add .
git commit -m "initial commit"
git branch -M main
npx husky install
