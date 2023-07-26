#!/bin/bash

echo -n "Enter kubernetes namespace: "
read k8s_namespace
echo -n "Enter app name: "
read app_name
echo ""

kubectl -n $k8s_namespace rollout history deploy $app_name
echo ""

echo -n "Enter revision number: "
read revision_number

read -p "Would you like to describe the revision? (y/n) " answer
case ${answer:0:1} in
    y|Y )
        echo "Describing revision $revision_number"
        kubectl -n $k8s_namespace rollout history deploy $app_name --revision=$revision_number
    ;;
    n|N )
        echo "Continuing..."
    ;;
    * )
        echo "Invalid input"
    ;;
esac


read -p "Are you sure you'd like to continue with revision $revision_number? (y/n) " answer
case ${answer:0:1} in
    y|Y )
        echo "Rolling back to revision #$revision_number"
        kubectl -n $k8s_namespace rollout undo deploy $app_name --to-revision=$revision_number
    ;;
    n|N )
        echo "Cancelling..."
    ;;
    * )
        echo "Invalid input"
    ;;
esac
