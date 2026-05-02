#!/bin/bash

TIMEOUT=30

for id in $(docker ps -q); do 
    START_TIME=$(docker inspect -f '{{.State.StartedAt}}' $id)

    START_SEC=$(date -d "$START_TIME" +%s)
    NOW_SEC=$(date +%s)

    DIFF=$((NOW_SEC - START_SEC))

    if [ $DIFF -gt $TIMEOUT ]; then
        echo "Killing Container $id (running ${DIFF}s)"
        docker kill $id
    fi
done