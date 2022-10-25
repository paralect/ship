#!/bin/sh
export DOCKER_CLIENT_TIMEOUT=600
export COMPOSE_HTTP_TIMEOUT=600
Green='\033[0;32m' 
Color_Off='\033[0m'

echo 'You can start services independently'
echo $Green'./bin/start.sh api migrator scheduler web'

echo $Color_Off
docker compose up --build "$@"
