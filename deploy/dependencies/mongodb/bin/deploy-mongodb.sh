#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

helm repo add bitnami https://charts.bitnami.com/bitnami

helm install --name mongodb --namespace mongodb bitnami/mongodb \
  -f ./values/values.yml \
