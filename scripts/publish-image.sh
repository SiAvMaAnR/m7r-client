#!/bin/bash

set -e

if [ -z "$1" ]; then
  IMAGE_NAME="samarkinivan/messenger-client"
else
  IMAGE_NAME="$1"
fi

# build image from Dockerfile
docker buildx build -t $IMAGE_NAME .

# push to DockerHub
docker push $IMAGE_NAME

# cache clear
docker buildx prune -af
