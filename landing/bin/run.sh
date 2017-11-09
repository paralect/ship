#!/bin/bash
cd "$(dirname "$0")"
cd ../

IMAGE_NAME=paralect-stack-nextjs-landing

docker build -t $IMAGE_NAME -f ./Dockerfile.dev .

docker run -p "3002:3002" -t $IMAGE_NAME
