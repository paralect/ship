#!/bin/sh
docker-compose --file docker-compose.local-tests.yml up --build "$@"
