#!/usr/bin/env bash
helm upgrade --install ship-release ./ship --namespace app \
  --set imagesVersion="$(git rev-parse --verify HEAD)" \
  -f ./ship/values/secrets.yml -f ./ship/values/values.yml
