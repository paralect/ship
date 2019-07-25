#!/usr/bin/env bash
helm upgrade --install drone-secret-release ./drone --namespace drone-ci -f drone/values/values.yml -f drone/values/secrets.yml
helm upgrade --install drone-release stable/drone --namespace drone-ci -f drone/values/values.yml -f drone/values/secrets.yml
