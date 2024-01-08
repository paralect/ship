#!/bin/bash

read -p "What secret name? " secret_name

read -p "What stage? (staging, production) " stage

echo "Set up necessary environment variables"
read -p "Write MONGO_URI "  mongo_uri

read -p "Write MONGO_DB_NAME " mongo_db_name

read -p "Write API_URL " api_url

read -p "Write WEB_URL " web_url

declare -a additional_envs

while true; do
    read -p "Do you need to write more environment variables? (y/n) " response
        if [[ $response == "n" ]]; then
            break
        else
          read -p "What env name? " var_name
          read -p "What env value? " var_value

          additional_envs+=" --from-literal=$var_name=$var_value"
        fi
done

kubectl create namespace $stage

kubectl create -n $stage secret generic $secret_name --from-literal=MONGO_URI="$mongo_uri" --from-literal=MONGO_DB_NAME=$mongo_db_name --from-literal=API_URL=$api_url --from-literal=WEB_URL=$web_url $additional_envs

