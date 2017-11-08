#!/bin/sh
file=docker-compose.drone-tests.yml
docker-compose --file $file stop
docker-compose --file $file rm -f # remove old containers
docker-compose --file $file up --build "$@"
exitCode=$?
if [ "$exitCode" != "0" ]; then
   echo "Docker-compose build failed"
   exit $exitCode
fi

echo "Inspecting exited containers:"
docker-compose --file $file ps
docker-compose --file $file ps -q | xargs docker inspect -f '{{ .State.ExitCode }}' | while read code; do
    if [ "$code" != "0" ]; then
       exit $code
    fi
done
