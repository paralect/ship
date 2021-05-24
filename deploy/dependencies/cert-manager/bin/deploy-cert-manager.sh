#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm upgrade --install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v0.16.1 \
  --set installCRDs=true \
  --set ingressShim.defaultIssuerName=letsencrypt \
  --set ingressShim.defaultIssuerKind=ClusterIssuer

read -p "cluster issuer acme email: " email
helm upgrade --install cert-cluster-issuer ./cert-cluster-issuer --namespace cert-manager \
  -f ./cert-cluster-issuer/values/values.yml \
  --set clusterIssuer.acme.email=$email
