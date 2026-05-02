#!/bin/bash

SANDBOX_ID=$1
CODE=$2
ALLOW_NET=$3

IMAGE="node:22-alpine"

if [ "$ALLOW_NET" == "true" ]; then
    NETWORK="bridge"
else
    NETWORK="none"
fi

docker run -d \
    --name sandbox-$SANDBOX_ID \
    --memory=256m \
    --cpus=0.5 \
    --pids-limit=64 \
    --read-only \
    --network $NETWORK \
    $IMAGE node -e "$CODE"