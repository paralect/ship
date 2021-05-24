#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

read -p "clientID: " clientID
read -p "clientSecret: " clientSecret
read -p "admin github: " admin

helm upgrade --install drone stable/drone --namespace ci \
  -f values/values.yml \
  --set sourceControl.github.clientID=$clientID \
  --set sourceControl.github.clientSecretValue=$clientSecret \
  --set server.adminUser=$admin \
