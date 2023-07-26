#!/bin/bash

## prompt user for semantic tag
echo "Please enter your Gitlab Registry Username: "
read USERNAME
echo ""
echo "Please enter your Gitlab Personal Access Token: "
read TOKEN

docker login registry-1.docker.io \
-u $USERNAME \
-p $TOKEN
