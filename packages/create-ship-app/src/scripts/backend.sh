#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
cli_dir="$2"
api_dir="$3"
api_type="$4"
deployment_type="$5"
db_type="$6"
platform_common_dir="$7"
platform_specific_dir="$8"

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

# Download only services folder from monorepo

git clone --quiet --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/paralect/ship.git
cd ship
git sparse-checkout init --cone
git sparse-checkout add services deploy
git checkout
cd ../

cp -a ship/services/$api_dir/. .

if [ ! -z "$platform_common_dir" ]; then
  installService "deploy" "deploy/$platform_common_dir"
fi
if [ ! -z "$platform_specific_dir" ]; then
  installService "deploy" "deploy/$platform_specific_dir"
fi

rm -rf ship

# Rename services in docker-compose.yml

for i in docker-compose*; do
  perl -i -pe"s/ship/$project_name/g" $i
done

# Add github actions from deploy service

mkdir -p .github/workflows
mv deploy/.github/workflows/* .github/workflows

# Remove unused folders and files

bash $cli_dir/scripts/cleanup.sh "backend" $deployment_type "." $api_type $db_type

# Install modules and setup husky

git init
npm install
git add .
git commit -m "initial commit"
git branch -M main
npx husky install
