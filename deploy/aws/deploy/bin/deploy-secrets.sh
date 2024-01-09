#!/bin/bash

read -p "What stage? (staging, production) " stage

declare -a envs

while true; do
    read -p "What variable name? " var_name
    read -p "What variable value? " var_value

    envs+=" --from-literal=$var_name=$var_value"

    read -p "Do you need to write more environment variables? (y/n) " response
        if [[ $response == "n" ]]; then
            break
        fi
done

namespaces=$(kubectl get namespaces)

if ! grep -q "$stage" <<< "$namespaces"; then
    kubectl create namespace $stage
fi

kubectl create -n $stage secret generic "api-$stage-secret" $envs

