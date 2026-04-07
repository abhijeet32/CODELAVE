#!/bin/bash

echo "Running Sandbox Containers:"
docker stats --no-stream --format \
"table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"