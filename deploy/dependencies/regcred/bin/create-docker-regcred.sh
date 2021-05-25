#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

read -p "dockerhub username: " username
read -p "dockerhub password: " password

helm upgrade --install regcred ./ --namespace app \
  -f ./values/values.yml \
  --set imageCredentials.username=$username \
  --set imageCredentials.password=$password \
