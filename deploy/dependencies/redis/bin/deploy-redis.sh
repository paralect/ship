#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

helm install --name redis --namespace redis stable/redis \
  -f ./values/values.yml
