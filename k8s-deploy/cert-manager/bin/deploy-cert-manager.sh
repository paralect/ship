#!/usr/bin/env bash

helm upgrade --install cert-cluster-issuer ./cert-manager -f ./cert-manager/values/secrets.yml
helm repo add jetstack https://charts.jetstack.io
kubectl create namespace cert-manager
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
kubectl apply \
    -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.10/deploy/manifests/00-crds.yaml
helm upgrade --install cert-manager jetstack/cert-manager --namespace cert-manager --version v0.10.0  \
  --set ingressShim.defaultIssuerName=letsencrypt \
  --set ingressShim.defaultIssuerKind=ClusterIssuer
