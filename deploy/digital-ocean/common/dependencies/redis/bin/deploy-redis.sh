#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

kubectl create namespace redis

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

helm upgrade redis bitnami/redis \
  --install \
  --namespace redis \
  -f ./values/values.yml