#!/bin/sh
ansible-playbook ./deploy-influxdb.yml -i hosts "$@"
