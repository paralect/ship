#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

sh ./dependencies/nginx/bin/deploy-nginx.sh
sh ./dependencies/mongodb/bin/deploy-mongodb.sh
sh ./dependencies/redis/bin/deploy-redis.sh
sh ./dependencies/regcred/bin/create-docker-regcred.sh
