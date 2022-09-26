#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
cli_dir="$2"
api_dir="$3"
docker_compose_file_name="$4"
api_type="$5"
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

  if [ "$service" == "deploy" ]; then
    cp -a "ship/$service_dir/." "$service"
  else
    cp -a "ship/$service_dir/." "apps/$service"
  fi

  if [ "$service" != "deploy" ]; then
    cd "apps/$service"
    rm -rf "${filesToRemove[@]}"
    cd ../../
  fi
}

# Create the project directory from template

mkdir "$project_name"
cd "$project_name"
cp -a "$cli_dir"/template/. .

# Download only services and deploy folders from monorepo

git clone -b as_implement-turborepo --quiet --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/paralect/ship.git
cd ship
git sparse-checkout init --cone
git sparse-checkout add services deploy
git checkout
cd ../

# Install services from ship monorepo

installService "api" "services/$api_dir"
installService "web" "services/web"

if [ ! -z "$platform_common_dir" ]; then
  installService "deploy" "deploy/$platform_common_dir"
fi
if [ ! -z "$platform_specific_dir" ]; then
  installService "deploy" "deploy/$platform_specific_dir"
fi

cp "ship/.gitignore" "."

rm -rf ship

# Copy docker-compose.yml

cp "$cli_dir"/docker-compose/$docker_compose_file_name docker-compose.yml

if [ "$api_type" == ".NET" -a "$db_type" == "PostgreSQL" ]; then
  cp api/src/docker_postgres_init.sql .
fi

# Rename services in docker-compose.yml

for i in docker-compose*; do
  perl -i -pe"s/ship/$project_name/g" $i
done

# Add github actions from deploy service

mv deploy/.github/workflows/* .github/workflows
rm -rf deploy/.github

# Websocket config
cd apps/web

npm uninstall @microsoft/signalr
rm src/services/socket.signalr.service.ts
rm src/config/environment/development.dotnet.json

cd ../../

# Install modules and setup husky

npm install
git init
git add .
git commit -m "initial commit"
git branch -M main

npx husky install
