# Overview

We use next primary technologies for deployment:
* Docker
* Kubernetes
* Helm
* GitHub Actions

To use this guide comfortable you need to be a little familiar with them.

Deployment can be done manually on your local machine or with a CI/CD pipeline.

We automatically create deployment scripts for Digital Ocean and AWS, but you can use another cloud provider with minor changes in scripts.

## Deployment Flow

## External services you need

* Kubernetes cluster, you can create it on [Digital Ocean](https://www.digitalocean.com/) or [AWS](https://aws.amazon.com/).
* Container registry for your Docker images, mostly cloud providers has it ([Digital Ocean](https://www.digitalocean.com/products/container-registry), [AWS](https://aws.amazon.com/ecr/)).
* DNS provider account. We recommend [CloudFlare](https://www.cloudflare.com/), for AWS you can use [Route 53](https://aws.amazon.com/route53/).

## SSL

## Services

There are services of your application that you are deploying in Kubernetes cluster.

|Service|Description|Kubernetes Resource|
|:---|:---|:---|
|web|Next.js server that serves static files and API endpoints|Pod|
|api|Backend server|Pod|
|scheduler|Service that runs cron jobs|Pod|
|migrator|Service that migrates database schema. It deploys before api through Helm pre-upgrade [hook](https://helm.sh/docs/topics/charts_hooks/)|Job|

## Dependencies

There are

|Dependency|Description|
|:---|:---|
|ingress-nginx|Next.js server that serves static files and API endpoints
|redis|Backend server
|regcred|Service that schedules tasks from api

## Deploy scripts structure

```
/.github - GitHub Actions CI/CD pipelines for automated deployment on push in repo.
/app - helm charts for services.
/bin -  bash scripts for installing dependencies and other things.
/dependencies - folder with helm charts for dependencies.
  /dependency-name - dependency helm chart
/script - deployment scripts.
```
