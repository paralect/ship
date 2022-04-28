# Overview

We use next primary technologies for deployment:
* [Docker](https://www.docker.com/)
* [Kubernetes](https://kubernetes.io/)
* [Helm](https://helm.sh/)
* [GitHub Actions](https://github.com/features/actions)

To use this guide comfortable you need to be a little familiar with them.

Deployed application is a list of services, that wrapped inside Docker containers and runned inside Kubernetes cluster.

Ship consists from 4 services by default: web, api, scheduler and migrator.

Deployment can be done manually on your local machine or with a CI/CD pipeline.

We automatically create deployment scripts for Digital Ocean and AWS, but you can use another cloud provider with minor changes in scripts.

## External services you need

* Kubernetes cluster, you can create it on [Digital Ocean](https://www.digitalocean.com/) or [AWS](https://aws.amazon.com/).
* Container registry for your Docker images, mostly cloud providers has it ([Digital Ocean](https://www.digitalocean.com/products/container-registry), [AWS](https://aws.amazon.com/ecr/)).
* DNS provider account. We recommend [CloudFlare](https://www.cloudflare.com/), for AWS you can use [Route 53](https://aws.amazon.com/route53/).
* Managed MongoDB. We recommend [MongoDB Atlas](https://www.mongodb.com/atlas/database) and [Digital Ocean](https://www.digitalocean.com/products/managed-databases-mongodb) 

## Deployment flow

To deploy some service deployment script builds Docker image, adds image tag and push it to registry.

Image tag consists from repo branch and commit hash.
```shell
imageTag = `${branch}.${commitSHA}`;
```

Then script creates Helm [release](https://helm.sh/docs/intro/using_helm/#three-big-concepts), that will install new version of the service in the cluster.

So, deployment process is pretty simple, it consists of two main parts: push built Docker image to registry and deploy it to Kubernetes cluster.

```javascript
const buildAndPushImage = async ({ dockerFilePath, dockerRepo, dockerContextDir, imageTag, environment }) => {
  await execCommand(`docker build \
    --build-arg APP_ENV=${environment} \
    -f ${dockerFilePath} \
    -t ${dockerRepo} \
    ${dockerContextDir}`);
  await execCommand(`docker tag ${dockerRepo} ${imageTag}`);
  await execCommand(`docker push ${imageTag}`);
}

const pushToKubernetes = async ({ imageTag, appName, deployConfig }) => {
  await execCommand(`
    helm upgrade --install apps-${config.environment}-${appName} ${deployDir} \
      --namespace ${config.namespace} --create-namespace \
      --set appname=${appName} \
      --set imagesVersion=${imageTag} \
      -f ${deployDir}/${config.environment}.yaml \
      --timeout 35m \
  `);
}

// build web image and push it to registry
await buildAndPushImage({
  ...deployConfig,
  imageTag: `${deployConfig.dockerRepo}:${imageTag}`,
  environment: config.environment
});

// deploy web to kubernetes
await pushToKubernetes({
  imageTag,
  appName: 'web',
  deployConfig
});

```

## Deployment order

We use [Rolling Update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) for deployment.

Web deploys separately and api, scheduler, migrator deploys together.
Migrator deploys before api and scheduler.

If migration fails api and scheduler will be not deployed.
This approach gives us a guarantee that the api and scheduler always work with the appropriate database schema.

## Database setup

We recommend avoiding database deployment inside cluster and use some third-party service like [MongoDB Atlas](https://www.mongodb.com/atlas/database) that provides managed database. It handles a lot of complex things: database deployment, backups, scaling, security.

After you create the database you will need to add a connection string in the [config](https://github.com/paralect/ship/blob/master/examples/base/api/src/config/environment/production.json).

```json
  {
  "mongo": {
    "connection": "mongodb+srv://<username>:<password>@<db>/api-production?retryWrites=true&w=majority",
    "dbName": "api-production"
  }
}
```

## SSL

In order for your application to work in modern browsers and be secure, you need to configure SSL certificates.
The easiest way would be to use [CloudFlare](https://www.cloudflare.com/), it allows you to set up SSL in most simple way by proxying all traffic through CloudFlare. Use this [guide](https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/).

CloudFlare allows exporting DNS records from other services like [GoDaddy](https://www.godaddy.com/). Also, you can buy domain inside CloudFlare.

If you are deploying in AWS you can use [AWS Certificate Manager](https://aws.amazon.com/ru/certificate-manager/) for SSL.

## Services

Application services packaged as Helm Charts.

To deploy services in cluster manually you need to set cluster authorization credentials inside [config](https://github.com/paralect/ship/blob/master/examples/base/deploy/script/src/config.js) and run deployment [script](https://github.com/paralect/ship/blob/master/examples/base/deploy/script/src/index.js).

```shell
node index

? What service to deploy? (Use arrow keys)
  api
  web
```

When you will configure GitHub Secrets in your repo, GitHub Actions will automatically deploy your services on push in repo.
You can check required secrets inside [workflows](https://github.com/paralect/ship/blob/master/examples/base/.github/workflows) files.

|Service|Description|Kubernetes Resource|
|:---|:---|:---|
|[web](https://github.com/paralect/ship/blob/master/examples/base/deploy/app/web)|Next.js server that serves static files and API endpoints|Pod|
|[api](https://github.com/paralect/ship/blob/master/examples/base/deploy/app/api)|Backend server|Pod|
|[scheduler](https://github.com/paralect/ship/blob/master/examples/base/deploy/app/scheduler)|Service that runs cron jobs|Pod|
|[migrator](https://github.com/paralect/ship/blob/master/examples/base/deploy/app/api/templates/job.yaml)|Service that migrates database schema. It deploys before api through Helm pre-upgrade [hook](https://helm.sh/docs/topics/charts_hooks/)|Job|

If you are adding new service, you need to configure it in [app](https://github.com/paralect/ship/blob/master/examples/base/deploy/app) and [script](https://github.com/paralect/ship/blob/master/examples/base/deploy/script/src) folders.
You can do it following the example from neighboring services.

## Dependencies

Third-party services packaged as Helm Charts and utils scripts.

To deploy dependencies in cluster, you need to run [deploy-dependencies.sh](https://github.com/paralect/ship/blob/master/examples/base/deploy/bin/deploy-dependencies.sh) script.
```shell
bash deploy-dependencies.sh
```

|Dependency|Description|
|:---|:---|
|[ingress-nginx](https://github.com/kubernetes/ingress-nginx)|Ingress controller for Kubernetes using Nginx as a reverse proxy and load balancer|
|[redis](https://github.com/bitnami/charts/tree/master/bitnami/redis)|Open source, advanced key-value store|
|[regcred](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/dependencies/regcred)|Bash script for creating Kubernetes [Secret](https://kubernetes.io/docs/concepts/configuration/secret/). Secret needs for authorizing in Container Registry when pulling Images from cluster. Required only for Digital Ocean clusters|

If you are adding new dependency, you need to create separate folder inside [dependencies](https://github.com/paralect/ship/blob/master/examples/base/deploy/dependencies) folder and configure new Chart.
Also, you need to add new dependency in [deploy-dependencies.sh](https://github.com/paralect/ship/blob/master/examples/base/deploy/bin/deploy-dependencies.sh) script.
You can do it following the example from neighboring dependencies.


## Deploy scripts structure

|Folder|Description|
|:---|:---|
|[.github](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/.github/workflows)|GitHub Actions CI/CD pipelines for automated deployment on push in repo|
|[app](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/app)|Helm charts for services|
|[bin](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/bin)|Utils scripts|
|[dependencies](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/dependencies)|Helm charts for dependencies|
|[script](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/script)|Deployment scripts|
