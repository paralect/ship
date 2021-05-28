#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  -f ./values/values.yml
