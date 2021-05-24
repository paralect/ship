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

Helm is a package manager for Kubernetes. **Currently we are using helm v2.** To install helm client follow [helm installation docs](https://v2.helm.sh/docs/install/)<br/>
*You do not need to install tiller*

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

Dependencies include:
- cluster dependencies ([tiller](https://v2.helm.sh/docs/install/) (helm server), [regcred](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/) (for pulling docker images from private dockerhub repos), nginx)
- app dependencies (redis, mongodb)

Before setup them do not forget to set your db name and db user username by changing [mongo helm chart values](dependencies/mongodb/values/values.yml)

To setup dependencies run command:

```
sh ./bin/deploy-dependencies.sh
```

mongodb connection string (for connection from deployed app) will look like `"mongodb://{db user}:{db user password}@{db service name}.{db namespace}.svc.cluster.local:{db port}/{db name}"`

Default values:
- db user - `admin`
- db service name - `mongodb`
- db namespace - `mongodb`
- db port - `27017`
- db name - `staging-db`

To get mongodb password for created user run command:

```
kubectl get secret --namespace mongodb mongodb -o jsonpath={.data.mongodb-password}
```

*Password will be in base64. To use it you need to encode it. Use any encoder (ex. [this](https://www.base64decode.org/))*

To connect to mongodb from outside you can use port forward:

```
kubectl get pods --namespace mongodb
kubectl port-forward {db pod name} --namespace mongodb 27018:27017
```

After that you can connect to mongodb on `localhost:27018` using your user credentials

If port forward doesn't fit you you can expose mongodb using command:

```
kubectl expose pod {db pod name} --type=LoadBalancer -n mongodb
```

## Setup DNS records

To see cluster nginx external ip run command:

```
kubectl get services -n ingress-nginx
```

*ip doesn't appear immediately after dependencies setup. It can take a few minutes*

After that you can use this ip to setup DNS A records with DNS provider (ex. [cloudflare](https://www.cloudflare.com/))<br/>
*the record doesn't start to work immediately. It can take some time*

## Configure https

If you don't want to use https you need to remove this lines from [ingress template file](app/templates/ingress.yml):

```
tls:
  - hosts:
    - {{ $service.ingress.host }}
```

Otherwise, setup cert-manager and cert-cluster-issuer by running command:

```
sh ./bin/deploy-cert-manager.sh
```

[cert-manager docs](https://cert-manager.io/docs/installation/kubernetes/)

## Setup CI

If you don't want to use CI or want to use existing CI server skip this step

Currently we are using [drone CI](https://github.com/helm/charts/tree/master/stable/drone)

Before setup:

Move [drone pipeline file](dependencies/drone-ci/.drone.yml) to root of you project repo. Update it if needed

Update CI host by changing [CI helm chart values](dependencies/drone-ci/values/values.yml)

If you didn't setup cert-manager you need to change protocol to http and remove lines in [CI helm chart values](dependencies/drone-ci/values/values.yml):

```
tls:
  - hosts:
      - ci.paralect.net
    secretName: letsencrypt
```

Create OAuth App on GitHub (Settings -> Developer settings -> OAuth Apps -> New OAuth App)

Run command:

```
sh ./bin/deploy-ci.sh
```

After that go to drone CI host and turn it on for your project repo

Add CI variables:
- docker_username (dockerhub username)
- docker_password (dockerhub password)
- kube_config (your cluster config)

## Update project specific variables

By default app deploys in `app` namespace. If you want to use one Kubernetes cluster for several envs, you can change it by changing [app values](app/values/values.yml) and [script config](script/src/config.js). Also you will need to deploy regcred to the namespace you want to use. To do it you can use [script](dependencies/regcred/bin/create-docker-regcred.sh)

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
