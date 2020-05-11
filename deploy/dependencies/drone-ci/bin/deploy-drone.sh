#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

read -p "clientID: " clientID
read -p "clientSecret: " clientSecret
read -p "admin github: " admin

helm upgrade --install drone-secret-release ./drone --namespace drone-ci \
  -f drone/values/values.yml \
  --set sourceControl.github.clientID=$clientID \
  --set clientSecret=$clientSecret \
  --set server.adminUser=$admin
helm upgrade --install drone-release stable/drone --namespace drone-ci \
  -f drone/values/values.yml \
  --set sourceControl.github.clientID=$clientID \
  --set clientSecret=$clientSecret \
  --set server.adminUser=$admin
