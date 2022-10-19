---
sidebar_position: 3
---

# AWS

It's a step-by-step Ship deployment guide. We will use [Amazon Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks), [Mongo Atlas](https://www.mongodb.com/), [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr), [GitHub Actions](https://github.com/features/actions) for automated deployment, and [CloudFlare](https://www.cloudflare.com) for DNS and SSL configuration.

You need to create [GitHub](https://github.com), [AWS](https://aws.amazon.com), [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and [CloudFlare](https://www.cloudflare.com/) accounts and install the next tools on your machine before starting:

* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) - CLI tool for accessing Kubernetes cluster (We recommend installing it via [Docker Desktop](https://www.docker.com/products/docker-desktop));
* [kubectx](https://github.com/ahmetb/kubectx) - CLI tool for easier switching between Kubernetes contexts;
* [helm](https://helm.sh/docs/intro/install) - CLI tool for managing Kubernetes deployments;
* [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - CLI tool for managing AWS resources;
* [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html) - CLI tool for managing EKS clusters;

Try the next commands to ensure that everything is installed correctly:

```
kubectl get pods -A

kubectx

helm list

aws sts get-caller-identity

eksctl

```

Also, you need [git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/) if you already haven't.

## Setup project

First, initialize your project. Type ```npx create-ship-app init``` in the terminal then choose **Full-Stack** build type and **AWS EKS** deployment type.

![Init project](/img/deployment/aws/init-project.png)

You will have the next project structure.

```shell
/my-app
  /.github
  /apps
    /api
    /web
  /deploy
  ...
```

Create GitHub private repository and upload the source code.

![Private repo](/img/deployment/aws/private-repo.png)

```shell
cd my-app
git remote add origin git@github.com:fruneen/my-app.git
git branch -M main
git push -u origin main
```

## AWS Regions

AWS Regions are physical locations of AWS clusters data centers. Each group of logical data centers calls Availability Zone (AZ). AZs allow the operation of production applications and databases that are more highly available, fault-tolerant, and scalable.

Now you need to select an AWS region for future use of the services. You can read more about region selection for your workloads here: [What to Consider when Selecting a Region for your Workloads](https://aws.amazon.com/blogs/architecture/what-to-consider-when-selecting-a-region-for-your-workloads/).

For this deployment guide, we will use the **us-east-1**.

:::tip

Usually, you have to create AWS resources in a single region. If you don't see created resources, you may need to switch to the appropriate AWS region.

:::

## Container registry

You need to create [private repositories](https://console.aws.amazon.com/ecr/repositories) for storing Docker images. The deployment script will upload images to Container Registry during the build step, and Kubernetes will automatically pull these images from Container Registry to run a new version of the service during the deployment step.

Now we should create a repository for each service.

For Ship, we need to create repositories for the next services:
* [**API**](/docs/api/overview) - api
* [**Scheduler**](/docs/scheduler.md) - scheduler
* [**Migrator**](/docs/migrator.md) - migrator
* [**Web**](/docs/web/overview) - web

![Container Registry creation](/img/deployment/aws/container-registry-creation.png)

:::caution

You should create a private repository for each service manually.

:::

After creation, you should have the following 4 services in ECR
![Container Registry creation](/img/deployment/aws/container-registry-created.png)

Docker images for each service are stored in a separate repository.
During the deployment process script will automatically create paths to repositories in next format:

* [**API**](/docs/api/overview) - 402167441269.dkr.ecr.us-east-1.amazonaws.com/api;
* [**Scheduler**](/docs/scheduler.md) - r402167441269.dkr.ecr.us-east-1.amazonaws.com/scheduler;
* [**Migrator**](/docs/migrator.md) - 402167441269.dkr.ecr.us-east-1.amazonaws.com/migrator;
* [**Web**](/docs/web/overview) - 402167441269.dkr.ecr.us-east-1.amazonaws.com/web;

:::tip

Repository name`402167441269.dkr.ecr.us-east-1.amazonaws.com/api` consists of 5 values:
* `402167441269` - AWS account ID;
* `us-east-1` - AWS region.
* `dkr.ecr` - AWS service.
* `amazonaws.com` - AWS domain.
* `api` - service name.

:::

:::tip

Images for all environments will be uploaded to the same repository for each service.

:::

## Kubernetes cluster

Now let's create [EKS](https://aws.amazon.com/eks) cluster.

In the first step, we need to set the cluster name. A common practice is to use the project name for it. Also, you can add an environment prefix if you have separate clusters for each environment: `my-app-staging`, and `my-app-production`.
We can leave other parameters by default.

![Cluster Creation](/img/deployment/aws/cluster-creation.png)

After creation, you need to wait a bit until the cluster status becomes **Active**.

![Cluster Created](/img/deployment/aws/cluster-active-state.png)

After cluster creation, you should attach [EC2](https://aws.amazon.com/ec2) instances to the cluster. You can do it by clicking on the **Add Node Group** button on the **Compute** tab.

![Add Node Group](/img/deployment/aws/cluster-computing.png)

Set the node group name and select the only Node IAM role from the list.

![Node Group Configuration](/img/deployment/aws/node-group-configuration.png)

AWS recommends creating at least 2 nodes **t3.medium** instance type for the production environment.

![Node Group Instance Configuration](/img/deployment/aws/node-group-instance-configuration.png)

Now you need to configure the node group in the deployment script that we created on the second screenshot.  
Need to update the `nodeGroup` value to `pool-app`.

```javascript title=deploy/script/src/config.js
const config = {
  nodeGroup: 'pool-app'
};
```

## Accessing cluster from a local machine

Before working with the cluster, you need to [configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

For accessing the cluster we need to run the following command:

```shell
aws eks update-kubeconfig --region us-east-1 --name my-app
```
Where **us-east-1** is the cluster region and **my-app** is the cluster name.

If everything is ok you will be able to switch to your cluster.
Type `kubectx` in the terminal and select your cluster.

![Kubectx](/img/deployment/aws/kubectx.png)

:::tip

By default, the cluster name will have an arn-name type like  `arn:aws:eks:us-east-1:402167441269:cluster/my-app`.

To change it to a more convenient name, you can use the command `kubectx my-app=arn:aws:eks:us-east-1:402167441269:cluster/my-app`.

:::

Then try to get information about installed pods in the cluster. Type `kubectl get pods -A` in the terminal.

If you did all steps correctly you will see the next info in a terminal.

![Pods List](/img/deployment/aws/pods-list.png)

## Dependencies

Now we need to install our dependencies in the cluster.

|Dependency|Description|
|:---|:---|
|[ingress-nginx](https://github.com/kubernetes/ingress-nginx)|Ingress controller for Kubernetes using Nginx as a reverse proxy and load balancer|
|[redis](https://github.com/bitnami/charts/tree/master/bitnami/redis)|Open source, advanced key-value store. Redis needed for API service|

:::tip

You can read **[here](https://docs.nginx.com/nginx-ingress-controller/intro/how-nginx-ingress-controller-works/)** how ingress-nginx works.

:::

Configure [Helm Values](https://helm.sh/docs/chart_template_guide/values_files/) for ingress-nginx and redis. Need to update the `eks.amazonaws.com/nodegroup` value to `pool-app`.

```yaml title=deploy/dependecies/ingress-nginx/values/values.yml
controller:
  publishService:
    enabled: true
  nodeSelector:
    eks.amazonaws.com/nodegroup: pool-app

rbac:
  create: true

defaultBackend:
  enabled: false
```

```yaml title=deploy/dependecies/redis/values/values.yml
redis:
  nodeSelector:
    eks.amazonaws.com/nodegroup: pool-app

auth:
  password: super-secured-password

architecture: standalone
```

Open `deploy/bin` folder and run the bash script.

```shell
bash deploy-dependencies.sh
```

## DNS and SSL

Once you deploy ingress-nginx, it will create a Load Balancer with external IP. All incoming requests to services should be sent to Load Balancer external IP, then requests to our services will be routed to domains from Ingresses configuration by **ingress-nginx**.

To get Load Balancer IP type `kubectl get services -n ingress-nginx` in the terminal and copy `EXTERNAL-IP` of `ingress-nginx-controller`.

```shell
~ % kubectl get services -n ingress-nginx
NAME                                 TYPE           CLUSTER-IP       EXTERNAL-IP                                                              PORT(S)                      AGE
ingress-nginx-controller             LoadBalancer   10.100.220.127   a71ee1af9a5bc45e494df110e2b22fdb-633881399.us-east-1.elb.amazonaws.com   80:30799/TCP,443:31358/TCP   30m
```

:::tip

It takes some time while **ingress-nginx** will configure everything and provide `EXTERNAL-IP`.

:::

We are using Cloudflare for setting DNS records. You can [register](https://developers.cloudflare.com/registrar/get-started/register-domain/) a domain in Cloudflare or [transfer](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/) it from another service.

Open the **DNS** tab in Cloudflare and create two `CNAME` records for **Web** and **API** that point to Load Balancer external IP.

![CloudFlare Web](/img/deployment/aws/cloudflare-web.png)

![CloudFlare API](/img/deployment/aws/cloudflare-api.png)

Select the **Proxied** option that will proxy all traffic through Cloudflare.
It does a lot of awesome work, you can read more about it [here](https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/).
In our case, we use it for automatic **SSL** certificate generation.

:::tip

If you are deploying on a staging/demo environment add the corresponding postfix in the domain.
**Example**: ```my-app-staging```

:::

Now add your domains in helm templates and code. For example, we are deploying on a **production** environment, if you are deploying on **staging** you will need to update `staging.yaml` and `staging.json` files.

```yaml title=deploy/app/api/production.yaml
service: api
port: 3001
domain: my-app-api.paralect.com
```

```yaml title=deploy/app/web/production.yaml
service: web
port: 3002
domain: my-app.paralect.com
```

```json title=api/src/config/environment/production.json
{
  "apiUrl": "https://my-app-api.paralect.com",
  "webUrl": "https://my-app.paralect.com",
}
```

```json title=web/src/config/environment/production.json
{
  "apiUrl": "https://my-app-api.paralect.com",
  "webUrl": "https://my-app.paralect.com",
}
```

## MongoDB Atlas

Navigate to [MongoDB Atlas](https://cloud.mongodb.com/), sign in to your account and create a new database.

### Database creation

1. Select the appropriate type. Dedicated for a production environment, shared for staging/demo.
2. Select provider and region. We recommend selecting the same or closest region to the AWS EKS cluster.
3. Select cluster tier. Free M0 Sandbox should be enough for staging/demo environments. For production environment we recommended selecting the option that supports cloud backups, M10 or higher.
4. Enter cluster name

![Mongo cluster](/img/deployment/aws/mongo-create.png)

### Security and connection

After cluster creation, you'll need to set up security. Select the authentication type (username and password) and create a user.

![Mongo setup authentication](/img/deployment/aws/mongo-create-password.png)

Add IP addresses list, which should have access to your cluster. Add 0.0.0.0/0 IP address to allow anyone with credentials to connect.

![Mongo setup ip white list](/img/deployment/aws/mongo-create-ip-list.png)

After database creation, go to the dashboard page and get the URI connection string by pressing the `connect` button.

![Mongo dashboard](/img/deployment/aws/mongo-dashboard.png)

Select `Connect your application` option. Choose driver and mongo version, and copy connection string. Don't forget to replace `<password>` with your credentials.

![Mongo connect dialog](/img/deployment/aws/mongo-connection-string.png)

Now add this connection string to API config files. If you are deploying on a **production** environment, you will need to update `production.json` file.

```json title=api/src/config/environment/production.json
{
  "mongo": {
    "dbName": "api-production",
    "connection": "mongodb+srv://admin:<password>@ship.gxhfngj.mongodb.net/?retryWrites=true&w=majority"
  },
}
```

## CI/CD Preparation

Before setup CI/CD you need to create a separate user in AWS IAM with certain permissions, let's create this user.

First of all, we need to create a policy for our user and move to [IAM dashboard](https://console.aws.amazon.com/iamv2/home#/home). Open the **Policies** page in the sidebar and click **Create policy**. After choosing the **JSON** tab, insert the following config:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EKS",
            "Effect": "Allow",
            "Action": [
                "eks:DescribeCluster"
            ],
            "Resource": "*"
        },
        {
            "Sid": "ECR",
            "Effect": "Allow",
            "Action": [
                "ecr:CompleteLayerUpload",
                "ecr:GetAuthorizationToken",
                "ecr:UploadLayerPart",
                "ecr:InitiateLayerUpload",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage"
            ],
            "Resource": "*"
        }
    ]
}
```

![Policy Configuration](/img/deployment/aws/policy-config.png)

In the second step, you can optionally add tags to your policy.

And at the last step, you need to give your policy a name and review summary.

![Policy Review](/img/deployment/aws/policy-review.png)

Now we need to create a user, open the **Users** page in the sidebar and click **Add user**. After that, you need to give your user a name and select **Access key - Programmatic access** as an access type.

![User Creating](/img/deployment/aws/user-creating.png)

In the next step, you need to attach your policy to the user. Click **Attach existing policies directly** and select the policy, which we created recently.

![User Policy](/img/deployment/aws/user-policy.png)

At the next step, you can optionally add tags to your user.

The fourth step is to review your user and click **Create user**.

After that, you will see your **Access key ID** and **Secret access key**. You need to save them because you will not be able to see them again.

![User Credentials](/img/deployment/aws/user-credentials.png)

Now we need to give EKS permissions to our user. Use the following command to attach the user to kubernetes masters group:

```shell
eksctl create iamidentitymapping --cluster my-app --arn arn:aws:iam::402167441269:user/cicd --group system:masters --username cicd
```

In the **--arn** parameter you need to specify your user ARN, which you can find in the IAM dashboard.


## CI/CD

To automate deployment through GitHub Actions you need to configure [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) inside workflow files.

:::tip

The deployment will be triggered on each commit.  
Committing to the **main** branch will trigger a deployment in the **staging** environment, and committing to the **production** branch will trigger a deployment in the **production** environment.

:::

To check required Secrets you can open workflows in the `.github` folder at the root of your project.

To automate deployment to the **production** environment you need to create `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`, `AWS_ACCOUNT_ID`, `AWS_REGION` and `CLUSTER_NAME_PRODUCTION`  secrets for `api-production.yml` and `web-production.yml` workflows.

`AWS_ACCESS_KEY` and `AWS_SECRET_ACCESS_KEY` you can get information about secrets from the downloaded credentials file when creating a user for CI/CD.

![CI/CD user credentials](/img/deployment/aws/cicd-credentials.png)

`AWS_ACCOUNT_ID` you can get from the user menu in the upper right corner of the AWS Management Console.

![Account ID location](/img/deployment/aws/account-id.png)

`AWS_REGION` and `CLUSTER_NAME_PRODUCTION` you set according to your project, for this guide we use `us-east-1` and `my-app` respectively.

After adding all the secrets, you should have the same secrets as in the following screenshot.

![GitHub secrets](/img/deployment/aws/gh-secrets.png)

Now commit all changes to GitHub that will trigger deployment.

![CI start](/img/deployment/aws/ci-start.png)

Done! Application deployed and can be accessed by provided domain.

![CI finish](/img/deployment/aws/ci-finish.png)

![Deployment finish](/img/deployment/aws/deployment-finish.png)

![Deployed pods](/img/deployment/aws/deployed-pods.png)

:::tip

If something went wrong you can check the workflows logs on GitHub and use [**kubectl logs**](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#interacting-with-running-pods), [**kubectl describe**](https://kubernetes.io/docs/reference/kubectl/cheatsheet/#viewing-finding-resources) commands.

:::

## Manual deployment

To deploy services in the cluster manually you need to set cluster authorization credentials inside the **config**.  
Set `environment` and `namespace` to `production/staging` and set your AWS credentials into config.

```javascript title=deploy/src/config.js
const config = {
  rootDir,

  service: ENV.SERVICE,

  environment: ENV.ENVIRONMENT || 'production',

  namespace: ENV.NAMESPACE || 'production',

  kubeConfig: ENV.KUBE_CONFIG,

  home: ENV.HOME,

  AWS: {
    clusterName: ENV.CLUSTER_NAME || 'my-app',
    accessKey: ENV.AWS_ACCESS_KEY || 'AKIAV...',
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY || 'a+frRW...',
    region: ENV.AWS_REGION || 'us-east-1',
    accountId: ENV.AWS_ACCOUNT_ID || '40216...',
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
