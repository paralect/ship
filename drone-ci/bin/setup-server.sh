#!/bin/sh
ansible-playbook ./setup-server.yml -i ./hosts "$@"
