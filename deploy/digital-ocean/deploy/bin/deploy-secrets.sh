#!/bin/bash

read -p "What stage? (staging, production) " stage

declare -a secret_envs
declare -a configmap_envs
declare is_secret
declare is_configmap

namespaces=$(kubectl get namespaces)

if ! grep -q "$stage" <<< "$namespaces"; then
    kubectl create namespace $stage
fi

secret_name="api-$stage-secret"
configmap_name="api-$stage-configmap"

current_secret=$(kubectl get secret $secret_name -n $stage -o json)
current_configmap=$(kubectl get configmap $configmap_name -n $stage -o json)

while true; do
    read -p "What variable name? " var_name
    read -p "What variable value? " var_value
    read -p "Should be encoded? (y/n) " is_encoded

    if [[ $is_encoded == "y" ]]; then
      is_secret="true"
      if $current_secret > /dev/null 2>&1; then
          secret_envs+=(" --from-literal=$var_name=$var_value")
      else
        encoded_value=$(echo -n "$var_value" | base64)

        updated_secret=$(echo "$current_secret" | jq --arg var_value "$encoded_value" --arg var_name "$var_name" \
        '.data += { $var_name: $var_value }')

        current_secret="$updated_secret"
      fi
    else
      is_configmap="true"
      if $current_configmap > /dev/null 2>&1; then
          configmap_envs+=(" --from-literal=$var_name=$var_value")
      else
          updated_configmap=$(echo "$current_configmap" | jq --arg var_value "$var_value" --arg var_name "$var_name" \
           '.data += { $var_name: $var_value }')

          current_configmap="$updated_configmap"
      fi
    fi

    read -p "Do you need to write more environment variables? (y/n) " response
        if [[ $response == "n" ]]; then
            break
        fi
done

if [[ $is_secret == "true" ]]; then
    if $current_secret > /dev/null 2>&1; then
      kubectl create -n $stage secret generic $secret_name $secret_envs
    else
      kubectl apply -f <(echo "$current_secret") -n $stage
    fi
fi

if [[ $is_configmap == "true" ]]; then
    if $current_configmap > /dev/null 2>&1; then
        kubectl create -n $stage configmap $configmap_name $configmap_envs
    else
        kubectl apply -f <(echo "$current_configmap") -n $stage
    fi
fi
