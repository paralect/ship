#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../../../

version=$(git rev-parse --verify HEAD)
api_image=paralect/ship-api
web_image=paralect/ship-web
landing_image=paralect/ship-landing

echo Prepare api image
docker build -t "$api_image:$version" ./api
docker tag "$api_image:$version" $api_image:latest
docker push "$api_image:$version"

echo Prepare web image
docker build -t "$web_image:$version" ./web
docker tag "$web_image:$version" $web_image:latest
docker push "$web_image:$version"

echo Prepare landing image
docker build -t "$landing_image:$version" ./landing
docker tag "$landing_image:$version" $landing_image:latest
docker push "$landing_image:$version"
