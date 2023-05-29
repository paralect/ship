---
sidebar_position: 1
---

# Overview

We use the next primary technologies for deployment:
* [Docker](https://www.docker.com/) for delivering applications inside containers;
* [Kubernetes](https://kubernetes.io/) for containers orchestration;
* [Helm](https://helm.sh/) for managing Kubernetes applications;
* [GitHub Actions](https://github.com/features/actions) for CI/CD deployment;

To use this guide we highly recommend you to check their documentation and be familiar with basics.  

Deployed application is multiple services, wrapped in Docker containers and run inside the Kubernetes cluster.  
Ship consists of 4 services by default: [**Web**](/docs/web/overview), [**API**](/docs/api/overview), [**Scheduler**](/docs/scheduler.md) and [**Migrator**](/docs/migrator.md).

Deployment can be done manually from your local machine or via a CI/CD pipeline.
We have templates of deployment scripts for Digital Ocean and AWS, but you can use another cloud providers with minor changes.

## External services you need

* Kubernetes cluster, you can create [DO Managed Kubernetes](https://www.digitalocean.com/products/kubernetes) or [AWS EKS](https://aws.amazon.com/eks/);
* Container registry for your Docker images, mostly cloud providers has it own: [DO Container Registry](https://www.digitalocean.com/products/container-registry), [AWS ECR](https://aws.amazon.com/ecr/);
* DNS provider account. We recommend [CloudFlare](https://www.cloudflare.com/), for AWS you can use [Route 53](https://aws.amazon.com/route53/);
* Managed MongoDB. We recommend [MongoDB Atlas](https://www.mongodb.com/atlas/database) or [DO Managed MongoDB](https://www.digitalocean.com/products/managed-databases-mongodb);

## Deployment schema

![Deployment schema](/img/deployment/overview/deployment-schema.png)

## Deployment flow

The deployment flow is pretty simple. Once you make changes in any service, the script builds a new Docker image for it, adds **image tag** to it, and pushes it to the Container Registry.

Script passes the image tag to deployment command, so Kubernetes knows which image needs to be downloaded from the registry. Image tag consists of repo branch and commits hash.
```shell
imageTag = `${branch}.${commitSHA}`;
```

Then script grabs all resources templates([Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/), [Service](https://kubernetes.io/docs/concepts/services-networking/service/), etc) from the [templates](https://github.com/paralect/ship/blob/master/examples/base/deploy/app/api/templates) folder for services that are deploying, packages them as [Helm Chart](https://helm.sh/docs/topics/charts/), and creates [Helm Release](https://helm.sh/docs/intro/using_helm/#three-big-concepts) that installs all that resources in the cluster. During the release, Kubernetes will download a new Docker image from registry and use it to create a new version of the service in the cluster.

:::tip

We use [**Blue-Green**](https://martinfowler.com/bliki/BlueGreenDeployment.html) deployment through [**Rolling Update**](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/).

:::

This is the main part of the deployment script.

```javascript title=deploy/script/src/index.js
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
      --set nodePool=${config.nodePool} \
      --set containerRegistry=${config.dockerRegistry.name} \
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

We have 2 separate GitHub Actions [workflows](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions) for services: 
- Deploy [**Web**](/docs/web/overview)
- Deploy [**API**](/docs/api/overview), [**Scheduler**](/docs/scheduler.md), and [**Migrator**](/docs/migrator.md). Migrator deploys **before** API and Scheduler.

If the Migrator fails, API and Scheduler will be not deployed. This approach guarantees us that the API and Scheduler always work with the appropriate database schema.

:::tip

We have [**separate**](https://github.com/paralect/ship/tree/master/examples/base/.github/workflows) GitHub Actions workflows for different environments.

:::

## Environment variables

When deploying "Ship" to Kubernetes, it's essential to consider the configuration needs of different environments. 
By separating the environment-specific settings into dedicated files,
you can easily manage and deploy the application across environments.

The ```APP_ENV``` environment variable is typically set based on the environment in which the application is running.
Its value corresponds to the specific environment, such as "development", "staging" or "production".
This variable helps the application identify its current environment and load the corresponding configuration.

For the web application, by setting the environment variable ```APP_ENV```,
the application can determine the environment in which it is running and download the appropriate configuration file:

| APP_ENV       | File              |
| ------------- |-------------------|
| development   | .env.development  |
| staging       | .env.staging      |
| production    | .env.production   |

These files should contain specific configuration variables required for each environment.

In contrast, the API utilizes a single `.env` file that houses its environment-specific configuration.
This file typically contains variables like API keys, secrets, or other sensitive information.
To ensure security, it's crucial to add the `.env` file to the `.gitignore` file, 
preventing it from being tracked and committed to the repository.

When deploying to Kubernetes, 
you'll need to include the appropriate environment-specific configuration files in your deployment manifests. 
Kubernetes offers [**ConfigMaps**](https://kubernetes.io/docs/concepts/configuration/configmap/) and [**Secrets**](https://kubernetes.io/docs/concepts/configuration/secret/)
for managing such configurations. 

**ConfigMaps** are suitable for non-sensitive data,
while **Secrets** are recommended for sensitive information like API keys or database connection string. 
Ensure that you create **ConfigMaps** or **Secrets** in your Kubernetes cluster
corresponding to the environment-specific files mentioned earlier.

## Database setup

We recommend avoiding self-managed database solutions and use cloud service like [MongoDB Atlas](https://www.mongodb.com/atlas/database) that provides managed database. It handles many quite complex things: database deployment, backups, scaling, and security.

After you create the database you will need to add a connection string in the [config](https://github.com/paralect/ship/blob/master/examples/base/api/src/config/environment/production.json).

```json title=config/environment/production.json
  {
  "mongo": {
    "connection": "mongodb+srv://<username>:<password>@<db>/api-production?retryWrites=true&w=majority",
    "dbName": "api-production"
  }
}
```

## SSL

To make your application work in modern browsers and be secure, you need to configure SSL certificates.
The easiest way is to use [CloudFlare](https://www.cloudflare.com/), it allows you to set up SSL in most simple way by proxying all traffic through CloudFlare. Use this [guide](https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/).

Cloudflare can be used as DNS nameservers for your DNS registrar, such as [GoDaddy](https://www.godaddy.com/). Also, you can buy and register a domain in Cloudflare itself.

If you are deploying in AWS you can use [AWS Certificate Manager](https://aws.amazon.com/ru/certificate-manager/) for SSL.

## Services

Services are parts of your application packaged as Helm Charts.  

|Service|Description|Kubernetes Resource|
|:---|:---|:---|
|[**Web**](https://github.com/paralect/ship/blob/master/examples/base/web)|Next.js server that serves static files and API endpoints|Pod|
|[**API**](https://github.com/paralect/ship/blob/master/examples/base/api)|Backend server|Pod|
|[**Scheduler**](https://github.com/paralect/ship/blob/master/examples/base/api/src/scheduler)|Service that runs cron jobs|Pod|
|[**Migrator**](https://github.com/paralect/ship/blob/master/examples/base/api/src/migrations)|Service that migrates database schema. It deploys before api through Helm pre-upgrade [hook](https://helm.sh/docs/topics/charts_hooks/)|Job|

To deploy services in the cluster manually you need to set cluster authorization credentials inside [config](https://github.com/paralect/ship/blob/master/examples/base/deploy/script/src/config.js) and run deployment [script](https://github.com/paralect/ship/blob/master/examples/base/deploy/script/src/index.js).

```shell title=deploy/script/src
node index

? What service to deploy? (Use arrow keys)
  api
  web
```

When you will configure GitHub Secrets in your repo, GitHub Actions will automatically deploy your services on push in the repo.
You can check the required secrets inside [workflow](https://github.com/paralect/ship/tree/master/examples/base/.github/workflows) files.

:::tip

If you are adding new service, you need to configure it in [**app**](https://github.com/paralect/ship/blob/master/examples/base/deploy/app) and [**script**](https://github.com/paralect/ship/blob/master/examples/base/deploy/script/src) folders.
You can do it following the example from neighboring services.

:::

## Dependencies

Dependencies are third-party services packaged as Helm Charts and bash scripts that install configured resources in the cluster.

|Dependency|Description|
|:---|:---|
|[ingress-nginx](https://github.com/kubernetes/ingress-nginx)|Ingress controller for Kubernetes using Nginx as a reverse proxy and load balancer|
|[redis](https://github.com/bitnami/charts/tree/master/bitnami/redis)|Open source, advanced key-value store|
|[regcred](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/dependencies/regcred)|Bash script for creating Kubernetes [Secret](https://kubernetes.io/docs/concepts/configuration/secret/). Secret needs for authorizing in Container Registry when pulling images from cluster. Required only for Digital Ocean clusters|

To deploy dependencies in cluster, you need to run [deploy-dependencies.sh](https://github.com/paralect/ship/blob/master/examples/base/deploy/bin/deploy-dependencies.sh) script.
```shell title=deploy/bin
bash deploy-dependencies.sh
```

:::tip

If you are adding new dependency, you need to create separate folder inside [**dependencies**](https://github.com/paralect/ship/blob/master/examples/base/deploy/dependencies) folder and configure new Chart.
Also, you need to add new dependency in [**deploy-dependencies.sh**](https://github.com/paralect/ship/blob/master/examples/base/deploy/bin/deploy-dependencies.sh) script.
You can do it following the example from neighboring dependencies.

:::

## Deploy scripts structure

|Folder|Description|
|:---|:---|
|[.github](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/.github/workflows)|GitHub Actions CI/CD pipelines for automated deployment on push in repo|
|[app](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/app)|Helm charts for services|
|[bin](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/bin)|Utils scripts|
|[dependencies](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/dependencies)|Helm charts for dependencies|
|[script](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/script)|Deployment script|
