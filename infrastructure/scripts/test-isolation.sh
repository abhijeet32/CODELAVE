#!/bin/bash

# start sandbox container A
docker run -d --name sandbox-A --network none alpine sleep 300

# start sandbox container B
docker run -d --name sandbox-B --network none alpine sleep 300

echo "Testing ping from A -> B"

docker exec sandbox-A ping -c 2 sandbox-B || echo "Isolation Working"

docker rm -f sandbox-A sandbox-B