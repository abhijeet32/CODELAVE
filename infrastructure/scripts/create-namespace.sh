#!/bin/bash

SANDBOX_ID=$1

if [ -z "$SANDBOX_ID" ]; then
    echo "Usage: ./create-namespace.sh <sandbox-id>"
    exit 1
fi

NS_NAME="sandbox-ns-$SANDBOX_ID"

# create namespace
ip netns add $NS_NAME

echo "Created network namespace: $NS_NAME"