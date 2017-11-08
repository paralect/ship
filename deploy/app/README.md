## Getting Started

### Update project specific variables

1. Change `hosts/staging` to match you staging server ip address
2. Change `api_domain,web_domain,landing_domain` domains in the `vars/main.yml`
3. Change name of the docker images in the `deploy-app.yml` to match yours. e.x.: `paralect/ship-api` to `company/yourProduct-api`

### Setup commands

1. Use `./bin/setup-server.sh` for one time server configuration. That installs Docker, MongoDb and Nginx.
2. Use `./bin/setup-nginx.sh -i ./hosts/staging --extra-vars "env=staging"` for the first time and after nginx config changes to copy nginx template to the server.

### Manual deployment

1. Copy/paste `vars/credentials-template.yml` as `credentials.yml` (it's in .gitignore to keep you DockerHub credentials out of the repo)
2. Add your DockerHub credentials into `credentials.yml`
3. Manually run `./bin/deploy-staging.sh --extra-vars docker_tag=latest`. Change tag as needed.


### Deployment with Drone CI

CI server works in the following way:
1. Run tests when pull request created or modified.
2. Deploy changes to the staging environment once code pushed to the master branch
3. (TODO). Deploy changes to the production environment once code pushed to the production branch.

#### Drone CI configuration

1. Add DockerHub credentials (`docker_username, docker_password, docker_email`) from the Drone UI.
2. Copy/paste `Example CLI Usage` code from drone UI and paste into the terminal
3. Add your ssh_key for the deployment:
    ```
    drone secret add \
     -repository paralect/ship \
     -name SSH_KEY \
     -value @/Users/andrew/.ssh/id_rsa
    ```
