#!/bin/sh
ansible-playbook ./deploy-app.yml -i ./hosts/staging -u root --extra-vars "env=staging" "$@"
