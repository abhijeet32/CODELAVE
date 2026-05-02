#!/bin/bash

SANDBOX_ID=$1
NS_NAME="sandbox-ns-$SANDBOX_ID"

docker rm -f sandbox-$SANDBOX_ID 2>/dev/null

ip netns delete $NS_NAME 2>/dev/null

echo "Cleaned Sandbox: $SANDBOX_ID"