#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

sh ./dependencies/ingress-nginx/bin/deploy-ingress-nginx.sh
sh ./dependencies/redis/bin/deploy-redis.sh
sh ./dependencies/regcred/bin/create-docker-regcred.sh
