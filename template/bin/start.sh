#!/bin/sh
export DOCKER_CLIENT_TIMEOUT=600
export COMPOSE_HTTP_TIMEOUT=600
Green='\033[0;32m'
Color_Off='\033[0m'

echo 'You can start services independently'

printf "${Green}./bin/start.sh api migrator scheduler web mailer"
printf "${Color_Off}\n"

docker-compose up --build "$@"
