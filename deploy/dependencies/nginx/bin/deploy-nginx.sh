#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

kubectl create namespace ingress-nginx-helm

helm upgrade --install nginx-release stable/nginx-ingress \
  --set rbac.create=true --namespace=ingress-nginx-helm \
  --set defaultBackend.enabled=false \
  --set controller.publishService.enabled=true
