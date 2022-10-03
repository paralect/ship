#!/usr/bin/env bash
set -e
shopt -s dotglob

project_name="$1"
cli_dir="$2"
api_type="$3"
docker_compose_file_name="$4"
db_type="$5"
platform_common_dir="$6"
platform_specific_dir="$7"

# Clone project and create template

git clone https://github.com/paralect/ship.git
cp -a "ship/.net/." "$project_name"

# Install services from ship monorepo

cp -a "ship/template/apps/web/." "$project_name/web"

# Install deploy

cp -a "ship/deploy/$platform_common_dir/." "$project_name/deploy"
cp -a "ship/deploy/$platform_specific_dir/." "$project_name/deploy"

cd "$project_name"

mv deploy/.github/workflows/* .github/workflows
rm -rf deploy/.github

cd ../

# Copy docker-compose.yml

cp "ship/.net/docker-compose/$docker_compose_file_name" docker-compose.yml

if [ "$api_type" == ".NET" -a "$db_type" == "PostgreSQL" ]; then
  cp ship/.net/api/src/docker_postgres_init.sql .
fi

# Rename services in docker-compose.yml

cd "$project_name"

for i in docker-compose*; do
  perl -i -pe"s/ship/$project_name/g" $i
done

cd ../

rm -rf ship

# Remove unused folders and files

bash $cli_dir/scripts/cleanup.sh "api" $api_type $db_type

# Websocket config
cd web

npm uninstall socket.io-client
rm src/services/socket.service.ts
mv src/services/socket.signalr.service.ts src/services/socket.service.ts
rm src/config/environment/development.json
mv src/config/environment/development.dotnet.json src/config/environment/development.json

cd ../

# Install modules and setup husky

npm install
git init
git add .
git commit -m "initial commit"
git branch -M main

npm run bootstrap
npx husky install
