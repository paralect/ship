# SHIP

🔥 — this smiley means you have to replace some part of the readme with your project specific things. 
🔥 (add your product description here, few lines is good enough)

## Development process 

1. [Active Sprint](https://trello.com/b/Qur5fy2O/ship-backlog-template) Trello board — list of current sprint tasks to work on. (🔥 — link includes simple development process description, you can copy a board and replace this link)
2. [Backlog](https://trello.com/b/Qur5fy2O/ship-backlog-template) Trello board — list of tasks & bugs planned for the next sprint. (🔥 — link includes sample backlog trello board)
3. [Team Communication](https://paralect-stack.slack.com/messages) via [Slack](https://slack.com/). (🔥 — update link to your Slack account)
4. [Continious Integration Server](http://product-stack-ci.paralect.com) via [Drone CI](https://github.com/drone/drone) (🔥 — CI server is not configured, if you want to setup it, instructions are [here](./deploy/drone-ci/README.md).)

## Development consitution

 🔥 — we always agree on the most important things and document them in a simple readme. Keep it if you like it :)

[The constitution](./CONSTITUTION.md) is a core document which is followed and signed by every team member. Please, read constitution carefully and add yourself to the team list.

## Run project

The development environment has the only dependency which is [Docker](https://docs.docker.com/install/). All projects and infrastructure dependencies started using [docker-compose using single command](https://github.com/paralect/docker-compose-starter):

```
./bin/start.sh
```

### Run tests

Make sure to run them often: 

```
./bin/run-tests.sh 
```

## Envrionments

 🔥 — include links to your envrionment

|Environment|Url|
|:---|:----------|
|Production 🚀|`In few weeks ⚡️`|
|Staging ☠️|[http://ship-demo.paralect.com](http://ship-demo.paralect.com/)|


## Deployment

Deployment automation scripts located at `./deploy/app` directory. Read [here](./deploy/app/README.md) for more details.

## Technical improvements

This project was created using [Ship](https://github.com/paralect/ship) version 1.0.1 🚀. Check out updates on [Github](https://github.com/paralect/ship) or [subscribe](https://www.paralect.com/ship) to receive updates about new releases by email. 