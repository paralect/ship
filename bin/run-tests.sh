#!/bin/sh
docker-compose -f docker-compose.local-tests.yml up --build --abort-on-container-exit --exit-code-from api-test
