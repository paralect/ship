#!/bin/sh
ansible-playbook ./setup-server.yml -i ./hosts/staging -u root --extra-vars "env=staging" "$@"
