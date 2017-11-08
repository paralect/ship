#!/bin/sh
ansible-playbook ./setup-nginx.yml -i ./hosts "$@"
