#!/bin/bash
cd "$(dirname "$0")"
cd ../

IMAGE_NAME=paralect-stack-nextjs-landing

docker build -t $IMAGE_NAME -f ./Dockerfile.dev .

docker run -p "3000:3000" -t $IMAGE_NAME
