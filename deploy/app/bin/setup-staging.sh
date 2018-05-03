#!/bin/sh
ansible-playbook ./setup-server.yml -i ./hosts/staging --extra-vars "env=staging" "$@"
