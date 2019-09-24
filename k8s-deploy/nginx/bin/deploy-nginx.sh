#!/usr/bin/env bash

helm upgrade --install nginx-release stable/nginx-ingress \
  --set rbac.create=true --namespace=ingress-nginx-helm \
  --set defaultBackend.enabled=false \
  --set controller.publishService.enabled=true
