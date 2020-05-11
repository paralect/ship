#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

kubectl create -f ./rbac-config.yaml
helm init --service-account tiller --history-max 200