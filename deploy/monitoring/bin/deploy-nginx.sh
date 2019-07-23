#!/bin/sh
ansible-playbook ./deploy-nginx.yml -i hosts "$@"
