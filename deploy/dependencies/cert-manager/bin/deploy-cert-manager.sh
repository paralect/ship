#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

read -p "cluster issuer acme email: " email

kubectl apply --validate=false \
  -f https://github.com/jetstack/cert-manager/releases/download/v0.15.0/cert-manager.yaml

kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install --name cert-manager --namespace cert-manager --version v0.15.0 jetstack/cert-manager

helm upgrade --install cert-cluster-issuer ./cert-manager \
  --set clusterIssuer.acme.email=$email
