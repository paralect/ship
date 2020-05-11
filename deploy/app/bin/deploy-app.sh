#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

read -p "App to deploy: api | web | landing: " appname

helm upgrade --install "apps-$appname" ./ --namespace app \
  --set appname=$appname \
  --set imagesVersion="$(git rev-parse --verify HEAD)" \
  -f ./values/values.yml
