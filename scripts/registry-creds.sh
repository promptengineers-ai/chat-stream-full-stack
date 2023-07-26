#!/bin/bash

echo -n "Enter kubernetes namespace: "
read NAMESPACE
echo ""
echo -n "Enter email: "
read EMAIL
echo ""
echo -n "Enter registry personal access token: "
read DEPLOY_TOKEN

kubectl -n $NAMESPACE create secret docker-registry gitlab-credentials \
 --docker-server=registry.gitlab.example.com \
 --docker-username=gitlab-ci-token \
 --docker-password=$DEPLOY_TOKEN \
 --docker-email=$EMAIL

## Get new cred
kubectl -n $NAMESPACE get secret gitlab-credentials --output=yaml

echo ''
echo ''
kubectl -n $NAMESPACE get secret gitlab-credentials --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode