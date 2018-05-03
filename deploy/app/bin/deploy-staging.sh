#!/bin/sh
ansible-playbook ./deploy-app.yml -i ./hosts/staging --extra-vars "env=staging" "$@"
