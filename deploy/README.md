# Getting Started

Deploy scripts for Kubernetes 

External services you need:
- Kubernetes cluster (you can create it on [Digital Ocean](https://www.digitalocean.com/) for ex.)
- [DockerHub](https://hub.docker.com/) repos for you services (api, web, landing, admin)
- DNS provider account (ex. [cloudflare](https://www.cloudflare.com/))

[Kubernetes concepts](https://kubernetes.io/docs/concepts/)

Install kubectl and helm client before using it

Kubectl is a command line tool for controlling Kubernetes clusters. To install kubectl follow [kubectl installation docs](https://kubernetes.io/docs/tasks/tools/install-kubectl/)<br/>
After that you can create `.kube` folder in you home directory (if it not exist). Put your Kubernetes cluster to `.kube/config` file (or merge your cluster config into existing one)<br/>
To check if everything works run `kubectl get pods -A` in terminal. You should see some pods there<br/>
*Helpful [tool](https://github.com/ahmetb/kubectx) for managing several Kubernetes clusters*

Helm is a package manager for Kubernetes. To install helm client follow [helm installation docs](https://v2.helm.sh/docs/install/)<br/>

## Deploy scripts structure

```
/app - helm chart for app
/bin - bash scripts
/dependencies - folder with app dependencies (you can read what dependency is below)
  /dependency-name - dependency helm chart
/script - script for service deployments
```

[helm chart structure](https://v2.helm.sh/docs/developing_charts/#charts)

## Setup dependencies

```
sh ./bin/deploy-dependencies.sh
```

## Setup DNS records

To see cluster nginx external ip run command:

```
kubectl get services -n ingress-nginx
```

*ip doesn't appear immediately after dependencies setup. It can take a few minutes*

After that you can use this ip to setup DNS A records with DNS provider (ex. [cloudflare](https://www.cloudflare.com/))<br/>
*the record doesn't start to work immediately. It can take some time*

## Update project specific variables

By default app deploys in `staging` namespace. If you want to use one Kubernetes cluster for several envs, you can change it by changing [app values](app/values/values.yml) and [script config](script/src/config.js). Also you will need to deploy regcred to the namespace you want to use. To do it you can use [script](dependencies/regcred/bin/create-docker-regcred.sh)

[app values](app/values/values.yml) you need to check:
- ingress hosts
- deployments
- services
- ports
- namespace
- environment

## Manual deployment

For manual deployments we are using script. This script will deploy only one service. It will build image, push it to DockerHub and then push it to Kubernetes cluster

Install dependencies. In [script folder](script) run `npm i`

Update [script config](script/src/config.js) values

To deploy service in [script folder](script) run command:

```
node ./src/index.js
```
