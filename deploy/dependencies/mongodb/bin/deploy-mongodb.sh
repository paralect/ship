#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

helm install --name mongodb --namespace mongodb stable/mongodb \
  -f ./values/values.yml \
