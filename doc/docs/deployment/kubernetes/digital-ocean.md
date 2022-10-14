---
sidebar_position: 2
---

# Digital Ocean

It's a step-by-step Ship deployment guide. We will use Digital Ocean Managed [Kubernetes](https://www.digitalocean.com/products/kubernetes) and [MongoDB](https://www.digitalocean.com/products/managed-databases-mongodb), [Container Registry](https://www.digitalocean.com/products/container-registry), [GitHub Actions](https://github.com/features/actions) for automated deployment, and [CloudFlare](https://www.cloudflare.com/) for DNS and SSL configuration.

You need to create [GitHub](https://github.com/), [CloudFlare](https://www.cloudflare.com/), [Digital Ocean](https://www.digitalocean.com/) accounts and install the next tools on your machine before starting:

* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) - CLI tool for accessing Kubernetes cluster (We recommend installing it via [Docker Desktop](https://www.docker.com/products/docker-desktop/));
* [helm](https://helm.sh/docs/intro/install/) - CLI tool for managing Kubernetes deployments;
* [kubectx](https://github.com/ahmetb/kubectx) - CLI tool for easier switching between Kubernetes contexts;

Try the next commands to ensure that everything is installed correctly:

```
kubectl get pods -A

helm list

kubectx
```

Also, you need [git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/) if you already haven't.

## Setup project

First, initialize your project. Type ```npx create-ship-app init``` in the terminal then choose **Full-Stack** build type and **Digital Ocean Managed Kubernetes** deployment type.

![Init project](/img/deployment/digital-ocean/init-project.png)

You will have next project structure.

```shell
/my-app
  /.github
  /web
  /api
  /deploy
  ...
```

Create GitHub private repository and upload source code.

![Private repo](/img/deployment/digital-ocean/private-repo.png)

```shell
cd my-app
git remote add origin https://github.com/Oigen43/my-app.git
git branch -M main
git push -u origin main
```

## Container registry

You need to create [Container Registry](https://www.digitalocean.com/products/container-registry) for storing Docker images. The deployment script will upload images to Container Registry during the build step, and Kubernetes will automatically pull these images from Container Registry to run a new version of service during the deployment step.

![Container Registry creation](/img/deployment/digital-ocean/container-registry-creation.png)

After some time, you will get registry endpoint.

![Container Registry creation](/img/deployment/digital-ocean/container-registry-created.png)

Now you should configure the deployment script to point Container Registry.  
Need to update `dockerRegistry.name` value to `registry.digitalocean.com/oigen43/my-app`.

```javascript title=deploy/script/src/config.js
const config = {
  dockerRegistry: {
    name: 'registry.digitalocean.com/oigen43/my-app',
  },
};
```

`registry.digitalocean.com/oigen43/my-app` consists of 2 values:
* `registry.digitalocean.com/oigen43` - registry endpoint;
* `my-app` - project name;

Docker images for each service are stored in separate repository. 
In Digital Ocean repositories are created automatically when something is uploaded by specific paths.
During deployment process script will automatically create paths to repositories in next format:

* [**API**](/docs/api/overview) - registry.digitalocean.com/oigen43/my-app-api;
* [**Scheduler**](/docs/scheduler.md) - registry.digitalocean.com/oigen43/my-app-scheduler;
* [**Migrator**](/docs/migrator.md) - registry.digitalocean.com/oigen43/my-app-migrator;
* [**Web**](/docs/web/overview) - registry.digitalocean.com/oigen43/my-app-web;

:::tip

Images for all environments will be uploaded to the same repository for each service.

:::

## Kubernetes cluster

Now let's create [Managed Kubernetes](https://www.digitalocean.com/products/kubernetes) cluster. 

We recommend you to create a cluster in the region where your end-users are located, it will reduce response time to incoming requests to all services. Also, if your cluster will be located in one region with a Container Registry deployment process will be faster.

![Cluster Region](/img/deployment/digital-ocean/cluster-region.png)

Set Node pool name and configure Nodes.  
Digital Ocean recommends creating at least 2 nodes for the production environment.

![Cluster Capacity](/img/deployment/digital-ocean/cluster-capacity.png)

The last step is to set a cluster name. A common practice is to use the project name for it. Also, you can add an environment prefix if you have separate clusters for each environment: `my-app-staging`, `my-app-production`.

![Cluster Price](/img/deployment/digital-ocean/cluster-price.png)

Now you need to configure node pool in deployment script that we created on second screenshot.  
Need to update `nodePool` value to `pool-app`.

```javascript title=deploy/script/src/config.js
const config = {
  nodePool: 'pool-app'
};
```

## Accessing cluster from a local machine

You need to download cluster's kubeconfig, this file includes information for accessing cluster through `kubectl`.

![Kubeconfig Download](/img/deployment/digital-ocean/kubeconfig-download.png)

```yaml title=my-app-kubeconfig.yaml
clusters:
  - cluster:
      certificate-authority-data: ...
      server: ...
    name: do-fra1-my-app
contexts:
  - context:
      cluster: do-fra1-my-app
      user: do-fra1-my-app-admin
    name: do-fra1-my-app
current-context: do-fra1-my-app
kind: Config
preferences: {}
users:
  - name: do-fra1-my-app-admin
    user:
      token: ...
```

[Kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) files contain information about several clusters, you have your own on the local machine, it should have been created after `kubectl` installation.

You need to add information about the new cluster to your config.
Find `.kube/config` file on your machine, and add `cluster`, `context` and `user` values from the downloaded config to it.

If everything is ok you will be able to switch to your cluster.
Type `kubectx` in the terminal and select your cluster.  
Then try to get information about installed pods in the cluster. Type `kubectl get pods -A` in the terminal.

If you did all steps correctly you will see the next info in a terminal.

![Pods List](/img/deployment/digital-ocean/pods-list.png)

## Personal access token

To upload docker images in Container Registry and pull them after from cluster we need Digital Ocean [Personal Access Token](https://cloud.digitalocean.com/account/api/tokens).
When you created cluster, this token was automatically created.

![Digital Ocean Token](/img/deployment/digital-ocean/do-token.png)

Add **Write** scope to the token and change token's name to app name, it will be easier to find it in the future.

![Digital Ocean Update Token](/img/deployment/digital-ocean/do-token-update.png)

You can grab this token from kubeconfig that we downloaded from Digital Ocean.

```yaml
users:
  - name: do-fra1-my-app-admin
    user:
      token: dop_v1_...
```

:::caution

Be careful with Personal Access Token, if someone steals it he will get access to all resources from your Digital Ocean account.

:::

## Dependencies

Now we need to install our dependencies in the cluster.

|Dependency|Description|
|:---|:---|
|[ingress-nginx](https://github.com/kubernetes/ingress-nginx)|Ingress controller for Kubernetes using Nginx as a reverse proxy and load balancer|
|[redis](https://github.com/bitnami/charts/tree/master/bitnami/redis)|Open source, advanced key-value store. Redis needed for API service|
|[regcred](https://github.com/paralect/ship/blob/master/deploy/digital-ocean/dependencies/regcred)|Bash script for creating Kubernetes [Secret](https://kubernetes.io/docs/concepts/configuration/secret/). Secret needs for authorizing in Container Registry when pulling images from cluster|

:::tip

You can read **[here](https://docs.nginx.com/nginx-ingress-controller/intro/how-nginx-ingress-controller-works/)** how ingress-nginx works.

:::

Configure [Helm Values](https://helm.sh/docs/chart_template_guide/values_files/) for ingress-nginx. Need to update `doks.digitalocean.com/node-pool` value to `pool-app`.

```yaml title=deploy/dependecies/ingress-nginx/values/values.yml
controller:
  publishService:
    enabled: true
  nodeSelector:
    doks.digitalocean.com/node-pool: pool-app

rbac:
  create: true

defaultBackend:
  enabled: false

```

Open `deploy/bin` folder and run the bash script.

```shell
bash deploy-dependencies.sh
```

You will be prompted to enter some values when installing `regcred` dependency

```shell
dockerhub username: // Personal Access Token(dop_v1_...)
dockerhub password: // Personal Access Token(dop_v1_...)
namespace: // production or staging
```

## DNS and SSL

Once you deploy ingress-nginx, it will create a Load Balancer with external IP. All incoming requests to services should be sent to Load Balancer external IP, then requests to our services will be routed to domains from Ingresses configuration by **ingress-nginx**.

To get Load Balancer IP type `kubectl get services -n ingress-nginx` in the terminal and copy `EXTERNAL-IP` of `ingress-nginx-controller`.

```shell
oigen@MacBook-Pro-4 ~ % kubectl get services -n ingress-nginx
NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.245.201.160   138.68.124.241   80:30186/TCP,443:32656/TCP   28m
```

:::tip

It take some time  while **ingress-nginx** will configure everything and provide `EXTERNAL-IP`.

:::

We are using CloudFlare for setting DNS records. You can [register](https://developers.cloudflare.com/registrar/get-started/register-domain/) a domain in CloudFlare or [transfer](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/) it from another service. 

Open the **DNS** tab in CloudFlare and create two `A` records for **Web** and **API** that points Load Balancer external IP.

![CloudFlare Web](/img/deployment/digital-ocean/cloudflare-web.png)

![CloudFlare API](/img/deployment/digital-ocean/cloudflare-api.png)

Select the **Proxied** option that will proxy all traffic through Cloudflare.
It does a lot of awesome work, you can read more about it [here](https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/).
In our case we use it for automatic **SSL** certificates generation.

:::tip

If you are deploying on a staging/demo environment add the corresponding postfix in the domain.
**Example**: ```my-app-staging```

:::

Now add your domains in helm templates and code. In example, we are deploying on **production** environment, if you are deploying on **staging** you will need to update `staging.yaml` and `staging.json` files.

```yaml title=deploy/app/api/production.yaml
service: api
port: 3001
domain: my-app-api.paralect.net
```

```yaml title=deploy/app/web/production.yaml
service: web
port: 3002
domain: my-app.paralect.net
```

```json title=api/src/config/environment/production.json
{
  "apiUrl": "https://my-app-api.paralect.net",
  "webUrl": "https://my-app.paralect.net",
}
```

```json title=web/src/config/environment/production.json
{
  "apiUrl": "https://my-app-api.paralect.net",
  "webUrl": "https://my-app.paralect.net",
}
```

## Database

Now, let's create [Managed MongoDB](https://www.digitalocean.com/products/managed-databases-mongodb) cluster. Select the latest MongoDB version and choose the same region as the Kubernetes cluster, it will increase database requests speed.

![MongoDB Region](/img/deployment/digital-ocean/mongodb-region.png)

Choose a database configuration.

![MongoDB Configuration](/img/deployment/digital-ocean/mongodb-configuration.png)

The last step is to set a cluster name. A common practice is to use the project name for it. Also, you can add an environment prefix if you have separate clusters for each environment: `my-app-staging`, `my-app-production`.

![MongoDB Name](/img/deployment/digital-ocean/mongodb-name.png)

After some time database cluster will be created. Copy connection string and add it in **API** config.

![MongoDB Connection String](/img/deployment/digital-ocean/mongodb-connection-string.png)

:::caution

Change database name from `admin` to `api-production` or `api-staging` in connection string.

:::

```json title=api/src/config/environment/production.json
{
  "mongo": {
    "connection": "mongodb+srv://doadmin:<your-password>@my-app-88deb5f6.mongo.ondigitalocean.com/api-production?tls=true&authSource=admin&replicaSet=my-app",
    "dbName": "api-production"
  },
}
```

MongoDB cluster is open to all incoming connections by default, which is not secure. We need to select sources that will be allowed to connect to the database. Open the **Settings** tab, and select your k8s cluster. If you want to connect to the database from your machine also add your IP to **Trusted Sources**.

![Trusted sources](/img/deployment/digital-ocean/mongodb-trusted-sources.png)

## CI/CD

To automate deployment through Github Actions you need to configure [Github Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) inside workflow files.

:::tip

The deployment will be triggered on each commit.  
Committing to the **main** branch will trigger a deployment in the **staging** environment, and committing to the **production** branch will trigger a deployment in the **production** environment.

:::

To check required Secrets you can open workflows in the `.github` folder at root of your project.  
To automate deployment to the **production** environment you need to create `DIGITAL_OCEAN_TOKEN` and `KUBE_CONFIG_PRODUCTION` secrets for `api-production.yml` and `web-production.yml` workflows.

`DIGITAL_OCEAN_TOKEN`

![DO Secret](/img/deployment/digital-ocean/do-secret.png)

`KUBE_CONFIG_PRODUCTION`

![Kubeconfig Secret](/img/deployment/digital-ocean/kubeconfig-secret.png)

Now commit all changes to GitHub that will trigger deployment.

![CI start](/img/deployment/digital-ocean/ci-start.png)

Done! Application deployed and can be accessed by provided domain.

![CI finish](/img/deployment/digital-ocean/ci-finish.png)

![Deployment finish](/img/deployment/digital-ocean/deployment-finish.png)

![Deployed pods](/img/deployment/digital-ocean/deployed-pods.png)

:::tip

If something went wrong you can check the workflows logs on GitHub and use [**kubectl logs**](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#interacting-with-running-pods), [**kubectl describe**](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#viewing-finding-resources) commands.

:::

## Manual deployment

To deploy services in the cluster manually you need to set cluster authorization credentials inside the **config**.  
Set `environment` and `namespace` to `production/staging` and set your Personal Access Token  in `dockerRegistry.username` and `dockerRegistry.password`.

```javascript title=deploy/src/config.js
const config = {
  rootDir,

  service: ENV.SERVICE,

  environment: ENV.ENVIRONMENT || 'production',

  namespace: ENV.NAMESPACE || 'production',

  kubeConfig: ENV.KUBE_CONFIG,

  home: ENV.HOME,

  dockerRegistry: {
    name: 'registry.digitalocean.com/oigen43/my-app',
    username: ENV.DOCKER_AUTH_USERNAME || 'dop_v1_...',
    password: ENV.DOCKER_AUTH_PASSWORD || 'dop_v1_...',

    imageTag: ENV.IMAGE_TAG,
  },
};
```

Run the deployment **script**. It will do the same as the CI deployment, but you run it manually.

```shell title=deploy/script/src
node index

? What service to deploy? (Use arrow keys)
  api
  web
```
