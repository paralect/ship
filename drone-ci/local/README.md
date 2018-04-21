## Install Drone CI on local machine

Prerequisites:

1. [Docker](https://docs.docker.com/engine/installation/)
2. [Docker-compose](https://docs.docker.com/compose/install/)

Installing Drone CI:

1. Rename `drone-example.env` into `drone.env` and set your github clientId, clientSecret as well as your github username
2. Run one command to start Drone CI: `./bin/start-local.sh`

That's it! `./bin/start-local.sh` script uses `docker-compose` to run Drone UI and Drone Agent. Environment variables from `drone.env` are in the `.gitignore` to keep your secrets outside of github repository.