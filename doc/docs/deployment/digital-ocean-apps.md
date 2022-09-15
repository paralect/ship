---
sidebar_position: 4
---

# Digital Ocean Apps

It's a step-by-step Ship deployment guide. We will use Digital Ocean Managed [Apps platform](https://www.digitalocean.com/products/app-platform) and [GitHub Actions](https://github.com/features/actions) for automated deployment.
For DNS and SSL configuration [CloudFlare](https://www.cloudflare.com/) will be used.
For database we will use MongoDB hosted on [Mongo Atlas](https://www.mongodb.com/).

You need to create [GitHub](https://github.com/), [Digital Ocean](https://www.digitalocean.com/), [CloudFlare](https://www.cloudflare.com/), [Mongo Atlas](https://www.mongodb.com/cloud/atlas/register) and [Redis](https://redis.com/try-free/) accounts.

Also, you need git and Node.js if you already haven't.

## Setup project

First, initialize your project. Type ```npx create-ship-app init``` in the terminal then choose desired build type build type and **Digital Ocean Apps** as a cloud service provider.

![Init project](/img/deployment/digital-ocean-apps/init-project.png)

You will have next project structure.

```shell
/my-app
  /.github
  /web
  /api
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

## Digital Ocean Apps Platform

Navigate to digital ocean control panel and select `Apps` tab. From there you can create a new application. As SHIP contains two application - web and api, two application should be created.

Step-by-step application creation guide:

1. Initial step
* Select GitHub as a service provider. You might need to grant Digital Ocean access to your GitHub account
* Chose Repository with application
* Select branch which will be used for deployment
* [**Optional**] Select source directory if code is placed in subfolder (e.g `/web` for Web application, `/api` for API)

![Create app screen](/img/deployment/digital-ocean-apps/do-create-app.png)

2. Resourses setup
* Delete duplicated resource without dockerfile if you have one.
* Select desired plan (for stage/demo environments it is recommended to select basic plan, for production you might consider selecting more expensive plan).

![Create app resources](/img/deployment/digital-ocean-apps/do-create-app-step-2.png)

3. Environment variables
* [**Optional**] Add any environment variables you need into your application (e.g - `APP_ENV='production'`). You can skip this step and add required variables later

![Create app environment variables](/img/deployment/digital-ocean-apps/do-create-app-step-3.png)

4. Application name and hosted region
* [**Optional**] Select desired application name and/or region for your application

![Create app host](/img/deployment/digital-ocean-apps/do-create-app-step-4.png)

5. Review
* Verify everything is correct and create new resource

After application is created, you'll land on application dashboard page. Here you can see application status, check runtime logs, track deployment status, and manage application settings.

Before proceed to next steps, navigate to settings and expand `App spec` tab. Make sure it contains `dockerfile_path` key with correct path to application's Dockerfile.

![Create app review](/img/deployment/digital-ocean-apps/do-settings-app-spec.png)

## Mongo Atlas

Navigate to [mongodb](https://www.mongodb.com/cloud/atlas/register) and sign in into your account and create new database

Step-by-Step database creation guide:

1. Select desired type (`Dedicated` for production environment or `shared` for sandbox)
2. Select desired provider and region(recommended to select same or close region to DO application region)
3. Select cluster tier (`M0 Sanbox` for sanbox environments, for production it is recommended to selec one of the paid tiers)
4. [**Optional**] Change cluster name

![Mongo cluster](/img/deployment/digital-ocean-apps/mongo-create.png)

After cluster is created, You'll need to setup security
1. Select authentication type (username and password)

![Mongo setup authentication](/img/deployment/digital-ocean-apps/mongo-create-password.png)

2. Add list of ip addresses, which should have access to your cluster. (Add `0.0.0.0/0` ip address to allow anyone with credentials connect to cluster)

![Mongo setup ip white list](/img/deployment/digital-ocean-apps/mongo-create-ip-list.png)

Once database created, you'll land on dashboard page. Here you can get URI connection string by pressing `connect` button.

![Mongo dashboard](/img/deployment/digital-ocean-apps/mongo-dashboard.png)

Select `Connect your application` option. Chose driver and mongo version, and copy connection string. Don't forget ro replace `<password>` with password, added in step 1

![Mongo connect dialog](/img/deployment/digital-ocean-apps/mongo-connection-string.png)

Navigate to Digital Ocean App and add connection string to application's environment variables (under `settings` tab)

![Digital Ocean App's environment variables](/img/deployment/digital-ocean-apps/mongo-add-variable.png)

## Redis

Navigate to [redis](https://redis.com/try-free/) and create an account.

Select cloud provider and region and press `Let's start free` to finish database creation.

![Redis create database](/img/deployment/digital-ocean-apps/redis-creation.png)

Open settings of created database by clicking on it.

On the settings screen you can find public endpoint of database aswell as its password

![Redis public endpoint](/img/deployment/digital-ocean-apps/redis-public-endpoint.png)
![Redis password](/img/deployment/digital-ocean-apps/redis-password.png)

Form redis connection string using public endpoint and password - `redis://:<password@<public-endpoint>` and add this to DO Application environment variables

![Redis environment variable](/img/deployment/digital-ocean-apps/redis-environment-variable.png)

## Deployment process

You can find two github actions in `.github/workflows` folder, responsible for triggering deployment when you push changes in your repository. (If you chose frontend or backend on initialization step, you'll have one github workflow for selected application type)

These actions requires access tokens to access your digital ocean space and ID of your digital ocean application.
respectively theese are `DO_ACCESS_TOKEN` and `DO_APP_API_ID`/`DO_APP_WEB_ID`.

Navigate to digital ocean and open `API` tab in left side bar.
Click `Generate new  token`, choose name and expiration period, leave checkboxes as they are

![Do access token create](/img/deployment/digital-ocean-apps/do-access-token-create.png)

You'll see generated token in the list. Do not forget to copy value and store it in a safe place. You won't be able to copy value after leaving the page

![Do access token copy](/img/deployment/digital-ocean-apps/do-access-token-copy.png)

Next, navigate to `Apps` tab in left sidebar and open your digital ocean application.

You can find id of your application id in browser address bar.

![Do application id](/img/deployment/digital-ocean-apps/do-application-id.png)

Now you can add theese keys to your github repository's secrets.

Navigate to gitbub repository page and open `settings` tab (You must have `admin` or `owner` role to open this tab).
Open `secrets/Actions` tab and create three (two if you have only frontend/backend application) repository secrets -

* **DO_ACCESS_TOKEN** - Value of digital ocean personal access token.
* **DO_APP_API_ID** and **DO_APP_WEB_ID** - Ids of digital ocean applications

![Github secrets](/img/deployment/digital-ocean-apps/github-secrets.png)

## Note
If you selected either `Only Frontend` or `Only Backend` during project initialization, you'll need to update your github workflow file.

Go to your project root directory and open `.github/workflows/application-<api>/<web>-deployment.yml` file.

On row 7 you should see following string:

![Github workflow](/img/deployment/digital-ocean-apps/github-workflow.png)

Remove lines 6 and 7 and commit changes.

## Thats it
Project is set up and ready.







