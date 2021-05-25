#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

kubectl create namespace ingress-nginx

helm upgrade --install nginx stable/nginx-ingress --namespace=ingress-nginx \
  -f ./values/values.yml
