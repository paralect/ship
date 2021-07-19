#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

kubectl create namespace cert-manager

helm repo add jetstack https://charts.jetstack.io
helm repo update

helm upgrade cert-manager jetstack/cert-manager \
  --install \
  --namespace cert-manager \
  --version v1.0.3 \
  --set installCRDs=true

read -p "cluster issuer acme email: " email
helm upgrade cluster-issuer . \
  --install \
  --namespace cert-manager \
  -f ./cert-cluster-issuer/values/values.yml \
  --set name=letsencrypt \
  --set server=https://acme-v02.api.letsencrypt.org/directory \
  --set email=$email