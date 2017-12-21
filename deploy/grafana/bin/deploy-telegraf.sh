#!/bin/sh
ansible-playbook ./deploy-telegraf.yml -i ./hosts "$@"
