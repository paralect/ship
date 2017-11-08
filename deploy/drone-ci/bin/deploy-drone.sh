#!/bin/sh
ansible-playbook ./deploy.yml -i hosts "$@"
