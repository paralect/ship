# Pulumi Digital Ocean Configuration

This folder contains the Pulumi configuration for deploying various components of Ship on Digital Ocean.

## Overview

The configuration is designed to deploy the following components:

1. **API App**: This is the main backend service of application.
2. **Web App**: This represents the frontend service of application.
3. **Spaces Bucket**: A Digital Ocean Spaces bucket for storing static assets or files.
4. **Project**: A Digital Ocean project that groups all the above resources.

## Components

### API App

- **Name**: Name of API service.
- **Region**: Region for deployment.
- **Domain**: The domain name for the API.
- **Environment Variables**: Various environment variables required for the API to function, including database connections and URLs.
- **Services**: Defines the main API service.
- **Workers**: Defines the scheduler worker.
- **Jobs**: Defines the migrator job which runs pre-deployment.

### Web App

- **Name**: Name of Web service.
- **Region**: Region for deployment
- **Domain**: The domain name for the web app.
- **Environment Variables**: Various environment variables required for the web app to function.
- **Services**: Defines the main web service.

### Spaces Bucket

- **Name**: Name of the bucket.
- **Region**: Region for deployment.

### Project

- **Name**: Name of the project.
- **Description**: A brief description of the project.
- **Purpose**: The main purpose of the project, in this case, "Web Application".
- **Resources**: All the resources (API, Web App, Spaces Bucket) associated with this project.

## Setup

1. Ensure you have [Pulumi](https://www.pulumi.com/docs/get-started/install/) installed.
2. Login in pulumi for managing your stacks `pulumi login --local`
3. Create your [Personal Access Token](https://docs.digitalocean.com/reference/api/create-personal-access-token/) and [Access Keys](https://docs.digitalocean.com/products/spaces/how-to/manage-access/#access-keys) for Digital Ocean
4. Add Digital Ocean Token and keys to your configuration file (.bashrc or .zshrc): 
```
export DIGITALOCEAN_TOKEN=dop_v1_...
export SPACES_ACCESS_KEY_ID=DO...
export SPACES_SECRET_ACCESS_KEY=...
```
5. Give access to your GitHub repo by [this link](https://cloud.digitalocean.com/apps/github/install)
6. Init your stack via the following command `pulumi stack init organization/{project-name}/{environment}`. Replace `{project-name}` with your actual name of a project (also edit it `Pulumi.yaml`), `{environment}` (can be `staging` or `production`)
7. Copy .env.example to .env - `cp .env.example .env.{environment}` and fill in the required environment variables.
8. Install dependencies via `npm i`
9. Create the resources in created stack `pulumi up`


## Setup

1. **Install Pulumi**: If you haven't already, [install Pulumi](https://www.pulumi.com/docs/get-started/install/).
2. **Login to Pulumi**: Manage your stacks locally.
   ```bash
   pulumi login --local
   ```

3. **DigitalOcean Credentials**:
    - Generate a [Personal Access Token](https://docs.digitalocean.com/reference/api/create-personal-access-token/).
    - Create [Access Keys for Spaces](https://docs.digitalocean.com/products/spaces/how-to/manage-access/#access-keys).

4. **Update Configuration**: Add the DigitalOcean Token and keys to your shell configuration (e.g., `.bashrc` or `.zshrc`):
   ```bash
   export DIGITALOCEAN_TOKEN=dop_v1_...
   export SPACES_ACCESS_KEY_ID=DO...
   export SPACES_SECRET_ACCESS_KEY=...
   ```

5. **GitHub Access**: Authorize DigitalOcean to access your [GitHub repository](https://cloud.digitalocean.com/apps/github/install).

6. **Initialize Stack**: Replace `{project-name}` with your project's name (also update in `Pulumi.yaml`) and `{environment}` with your desired environment (`staging` or `production`).
   ```bash
   pulumi stack init organization/{project-name}/{environment}
   ```

7. **Environment Variables**: Copy the example environment file and set the required variables.
   ```bash
   cp .env.example .env.{environment}
   ```

8. **Install Dependencies**:
   ```bash
   npm install
   ```

9. **Deploy Resources**: Create the resources in the initialized stack.
   ```bash
   pulumi up
   ```