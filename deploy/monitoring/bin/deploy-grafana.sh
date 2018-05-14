#!/bin/sh
ansible-playbook ./deploy-grafana.yml -i hosts "$@"
