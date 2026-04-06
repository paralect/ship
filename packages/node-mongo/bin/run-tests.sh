#!/bin/sh
docker-compose -f docker-compose.tests.yml down --remove-orphans
docker-compose -f docker-compose.tests.yml up --build --force-recreate
