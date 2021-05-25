#!/bin/sh
file=docker-compose.drone-tests.yml
docker-compose -f $file up --build --force-recreate "$@"

exitCode=$?
if [ "$exitCode" != "0" ]; then
   echo "Docker-compose build failed"
   exit $exitCode
fi

echo "Inspecting exited containers:"
docker-compose -f $file ps
docker-compose -f $file ps -q | xargs docker inspect -f '{{ .State.ExitCode }}' | while read code; do
    if [ "$code" != "0" ]; then
       exit $code
    fi
done

docker-compose -f $file down
