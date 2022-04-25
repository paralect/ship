#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

read -p "dockerhub username: " username
read -p "dockerhub password: " password
read -p "namespace: " namespace

kubectl create namespace $namespace
kubectl create secret docker-registry regcred \
  -n $namespace \
  --docker-server="registry.digitalocean.com"  \
  --docker-username=$username \
  --docker-password=$password